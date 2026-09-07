const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

const parser = new Parser();

/**
 * 번역은 사이트 문구와 **같은 엔진·같은 용어집**을 쓴다 (scripts/translate-engines/).
 * 예전에는 비공식 패키지(google-translate-api-x)로 무료 구글 번역 웹 엔드포인트를
 * 긁어 썼는데, 회사명을 "Qtis Bio" 로 쪼개거나 문장을 중간에서 자르는 일이 잦아
 * 되돌리는 코드가 여럿 붙어 있었다. 용어집을 지시할 수 있는 엔진으로 옮기면서 걷어냈다.
 *
 * 로컬에서는 `.env.local`, GitHub Actions 에서는 저장소 시크릿에서 키를 읽는다.
 */
const TRANSLATE_ENGINE = process.env.TRANSLATE_ENGINE || 'openai';

// Google News is searched once per topic, always paired with the company name, and the
// results are merged. Searching the company name alone pulled in unrelated pharma and
// cosmetics coverage; these four pairs keep the newsroom on the indigo business.
const NEWS_COMPANY = '큐티스바이오';
const NEWS_TOPICS = ['인디고', '염료', '데님', '패션'];
const searchUrls = NEWS_TOPICS.map(
  (topic) =>
    `https://news.google.com/rss/search?q=${encodeURIComponent(`${NEWS_COMPANY} ${topic}`)}&hl=ko&gl=KR&ceid=KR:ko`
);

// An article is published automatically only when the company is named in it. Everything
// else goes to content/news-candidates.json for a human to approve.
//
// Why it is split this way: Google News RSS carries no real summary — contentSnippet is the
// headline plus the outlet name — and its links are javascript-gated news.google.com stubs,
// so the article body cannot be read either. Requiring the company AND a subject word in the
// text therefore reduces to "both must be in the headline", which matched 0 of 19 live items
// and 1 of 49 published ones: real coverage names the partner brand (르캐시미어, 코오롱FnC)
// rather than CutisBio. So the machine publishes what it can verify, and a person decides
// the rest. See docs/blugene-운영-메모.md §4.
const COMPANY_RE = /큐티스바이오|cutisbio/i;
const TOPIC_RE = /인디고|염료|데님|염색/i;
const CANDIDATES_PATH = path.join(__dirname, '../content/news-candidates.json');

/** `--dry-run` 이면 수집 결과만 출력하고 messages/*.json 을 건드리지 않는다 */
const DRY_RUN = process.argv.includes('--dry-run');

const locales = ['ko', 'en', 'ja', 'zh', 'tr', 'bn'];

const hardcodedNews = [
  {
    date: "2024-08-12",
    category: "제품출시",
    title: "큐티스바이오, 친환경 바이오 인디고 염색법 '아쿠아인디고' 개발",
    summary: "합성생물학 기술을 활용해 미생물 발효로 인디고 염색법을 구현한 '아쿠아인디고(AquaIndigo)'를 개발하여 친환경 패션 소재 시장에 진출했습니다.",
    thumbnailAlt: "AquaIndigo thumbnail",
    link: "https://www.tinnews.co.kr/26601"
  },
  {
    date: "2023-07-25",
    category: "업무협약",
    title: "큐티스바이오-카카오헬스케어-로레알, 정밀 뷰티 솔루션 개발 MOU 체결",
    summary: "바이오인포매틱스 기술을 활용한 정밀 뷰티 솔루션 개발 업무협약을 맺고 피부 마이크로바이옴 전문성을 결합합니다.",
    thumbnailAlt: "MOU thumbnail",
    link: "https://www.medigatenews.com/news/3760434771"
  },
  {
    date: "2022-12-19",
    category: "공동연구",
    title: "큐티스바이오-이뮤노바이옴, 차세대 마이크로바이옴 면역항암제 개발",
    summary: "이뮤노바이옴과 협력하여 합성생물학 기반의 재조합 균주를 활용한 차세대 마이크로바이옴 면역항암제 개발 연구를 진행합니다.",
    thumbnailAlt: "Research thumbnail",
    link: "https://www.pharmnews.com/news/articleView.html?idxno=216348"
  },
  {
    date: "2022-06-20",
    category: "업무협약",
    title: "대웅제약·대웅바이오·큐티스바이오, 친환경 약물소재 개발 협약",
    summary: "대웅그룹과 파트너십을 맺고 생촉매 기술을 활용해 친환경적이고 경쟁력 있는 의약품 원료 및 약물 소재 개발에 협력합니다.",
    thumbnailAlt: "Partner thumbnail",
    link: "https://www.hitnews.co.kr/news/articleView.html?idxno=39906"
  }
];

// 번역이 하나라도 실패하면 CI 가 조용히 반쪽짜리를 배포하지 않도록 표시해 둔다.
let translationFailed = false;

/**
 * 분류 배지는 정해진 몇 개뿐이라 **번역시키지 않고 표로 고정한다.**
 * 매번 번역에 맡겼더니 같은 `보도자료` 가 벵골어에서 세 가지로 갈렸다
 * (`প্রেস বিজ্ঞপ্তি` 9건 · `প্রেস রিলিজ` 9건 · 절반만 번역된 것 1건).
 * 같은 화면에서 배지 문구가 제각각이면 안 되고, 번역 토큰도 아낀다.
 *
 * 여기 없는 분류를 `hardcodedNews` 에 새로 쓰면 그때만 번역에 맡긴다.
 */
const CATEGORY_LABELS = {
  보도자료: {
    en: 'Press release', ja: 'プレスリリース', zh: '新闻稿',
    bn: 'প্রেস বিজ্ঞপ্তি', tr: 'Basın bülteni',
  },
  제품출시: {
    en: 'Product launch', ja: '製品発表', zh: '产品发布',
    bn: 'পণ্য লঞ্চ', tr: 'Ürün lansmanı',
  },
  업무협약: {
    // 이전 자동 번역이 業務条約(국가 간 조약)으로 잘못 나왔다 — 業務提携가 맞다.
    en: 'Partnership agreement', ja: '業務提携', zh: '业务合作协议',
    bn: 'ব্যবসায়িক চুক্তি', tr: 'İş birliği anlaşması',
  },
  공동연구: {
    en: 'Joint research', ja: '共同研究', zh: '联合研究',
    bn: 'যৌথ গবেষণা', tr: 'Ortak araştırma',
  },
};

/**
 * Google News RSS 는 요약을 주지 않는다. `contentSnippet` 이 본문이 아니라
 * "제목 + 매체명" 이다 (22건 중 19건). 그대로 두면 화면에 제목이 두 번 나오고,
 * 매체명이 한국어라 다른 언어 파일에 한글이 남아 검사에서 걸린다
 * (예: 튀르키예어 요약 끝에 "한국섬유신문").
 *
 * 그래서 요약이 제목의 반복이면 **비운다.** 화면은 요약이 없으면 그 줄을 그리지 않는다.
 * 제대로 된 요약이 필요한 기사는 `hardcodedNews` 에 직접 써 넣으면 된다.
 */
function normalizeSummary(article) {
  const title = (article.title || '').trim();
  const summary = (article.summary || '').trim();
  if (!summary || !title) return article;

  // "제목  매체명" 또는 "제목..." 형태면 알맹이가 없다
  const tail = summary.startsWith(title) ? summary.slice(title.length).trim() : null;
  const isEcho = tail !== null && tail.length <= 30; // 매체명 정도의 길이만 허용
  return isEcho ? { ...article, summary: '' } : article;
}

/** 엔진 어댑터와 용어집을 불러온다 (ESM 이라 동적 import 를 쓴다) */
async function loadTranslator() {
  const lib = await import('./translate-lib.mjs');
  lib.loadEnvLocal();
  const engine = await lib.loadEngine(TRANSLATE_ENGINE);
  if (!process.env[engine.envKey]) {
    throw new Error(
      `${engine.envKey} 가 없습니다. 로컬은 .env.local, GitHub Actions 는 저장소 시크릿에 넣어 주세요.`
    );
  }
  const glossary = lib.readJson(lib.GLOSSARY_PATH);
  console.log(`Translating with ${engine.label} (${engine.model()})`);
  return { engine, glossary };
}

async function updateNews() {
  // Fetch every topic feed. One failing feed must not lose the others, and if all of them
  // fail we simply keep whatever is already published (see the merge step below).
  const rssItems = [];
  let feedFailures = 0;
  for (let i = 0; i < searchUrls.length; i++) {
    const label = `${NEWS_COMPANY} ${NEWS_TOPICS[i]}`;
    try {
      const feed = await parser.parseURL(searchUrls[i]);
      const items = feed.items || [];
      console.log(`Fetched "${label}": ${items.length} items`);
      rssItems.push(...items);
    } catch (err) {
      feedFailures++;
      console.error(`Error fetching "${label}":`, err.message);
    }
  }
  if (feedFailures === searchUrls.length) {
    console.error('All news searches failed; keeping the previously published articles.');
    process.exitCode = 1;
  }

  let newKoArticles = [];

  for (let item of rssItems) {
    const titleMatch = item.title.lastIndexOf(' - ');
    const cleanTitle = titleMatch > -1 ? item.title.substring(0, titleMatch) : item.title;
    
    // Filter out articles about "아르큐티스" (Arcutis)
    if (cleanTitle.includes('아르큐티스') || (item.contentSnippet && item.contentSnippet.includes('아르큐티스'))) {
      continue;
    }

    // Filter out Daewoong exclusive articles (mentions Daewoong Bio/Pharm but not CutisBio in title)
    if ((cleanTitle.includes('대웅바이오') || cleanTitle.includes('대웅제약')) && !cleanTitle.includes('큐티스바이오')) {
      continue;
    }


    const pubDate = new Date(item.pubDate);
    const dateStr = pubDate.toISOString().split('T')[0];

    // Use the actual rss snippet if available, up to 120 characters to keep it brief
    let snippet = item.contentSnippet || item.content || "상세 내용은 원문 기사를 확인해 주세요.";
    if (snippet.length > 130) {
      snippet = snippet.substring(0, 130) + "...";
    }

    newKoArticles.push({
      date: dateStr,
      category: "보도자료",
      title: cleanTitle,
      summary: snippet,
      thumbnailAlt: "News thumbnail",
      link: item.link
    });
  }

  // Load previously collected Korean articles so that items no longer in the
  // RSS feed (Google News only returns the most recent ~20-100 results) are
  // not silently dropped from the site.
  const koFilePath = path.join(__dirname, '../messages/ko.json');
  let existingKoArticles = [];
  try {
    const koJson = JSON.parse(fs.readFileSync(koFilePath, 'utf8'));
    existingKoArticles = (koJson.News && koJson.News.articles) || [];
  } catch (e) {
    console.error('Could not read existing ko.json articles:', e.message);
  }

  // Merge: new RSS items first, then previously stored, then hardcoded history.
  // De-duplicate by link or title.
  const mergedArticles = [];
  const normTitle = (t) => (t || '').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
  const pushUnique = (article) => {
    const key = normTitle(article.title);
    if (!mergedArticles.find(a => a.link === article.link || normTitle(a.title) === key)) {
      mergedArticles.push(article);
    }
  };
  newKoArticles.forEach(pushUnique);
  existingKoArticles.forEach(pushUnique);
  hardcodedNews.forEach(pushUnique);

  // Filter out any articles before June 2020 and sort by date
  mergedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  const datedArticles = mergedArticles
    .filter(a => new Date(a.date) >= new Date('2020-06-01'))
    .map(normalizeSummary);

  // Previously reviewed candidates. `approved: true` publishes the article; the flag is the
  // only thing a person edits, so it must survive every run.
  let previousCandidates = [];
  try {
    previousCandidates = JSON.parse(fs.readFileSync(CANDIDATES_PATH, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') console.error('Could not read news-candidates.json:', e.message);
  }
  const approvedByLink = new Map(previousCandidates.map((c) => [c.link, c.approved === true]));

  // Two lanes: the company is named -> publish automatically. Everything else is written to
  // the candidates ledger and published only while its `approved` flag is true. Approved
  // entries stay in the ledger — dropping them would lose the flag and unpublish the article
  // on the next run. Nothing is ever deleted, so any article can be brought back.
  const finalArticles = [];
  const candidates = [];
  let approvedCount = 0;
  for (const article of datedArticles) {
    const text = `${article.title} ${article.summary || ''}`;
    if (COMPANY_RE.test(text)) {
      finalArticles.push(article);
      continue;
    }
    const approved = approvedByLink.get(article.link) === true;
    if (approved) {
      finalArticles.push(article);
      approvedCount++;
    }
    candidates.push({
      ...article,
      approved,
      // Written for the reviewer: true means it is about indigo/dyeing but the headline
      // names a partner brand instead of CutisBio — usually worth approving.
      onTopic: TOPIC_RE.test(text),
    });
  }
  candidates.sort(
    (a, b) =>
      Number(b.approved) - Number(a.approved) ||
      Number(b.onTopic) - Number(a.onTopic) ||
      b.date.localeCompare(a.date)
  );

  console.log(
    `Publishing ${finalArticles.length} articles ` +
      `(${finalArticles.length - approvedCount} name the company, ${approvedCount} approved by hand); ` +
      `${candidates.length - approvedCount} waiting for review ` +
      `(${candidates.filter((c) => !c.approved && c.onTopic).length} on topic).`
  );

  // `node scripts/update-news.js --dry-run` shows what would be published without touching
  // messages/*.json or content/news-candidates.json, and without calling the translation API.
  if (DRY_RUN) {
    const existingLinks = new Set(existingKoArticles.map((a) => a.link));
    const added = finalArticles.filter((a) => !existingLinks.has(a.link));
    console.log(`\n[dry-run] 수집 ${newKoArticles.length}건 · 기존 ${existingKoArticles.length}건`);
    console.log(`[dry-run] 노출 ${finalArticles.length}건 · 승인 대기 ${candidates.length}건`);
    console.log(`[dry-run] 이번에 새로 노출될 기사 ${added.length}건`);
    for (const a of added) console.log(`   + ${a.date}  ${a.title}`);
    const freshCandidates = candidates.filter((c) => !c.approved && !approvedByLink.has(c.link));
    console.log(`[dry-run] 새로 후보에 오르는 기사 ${freshCandidates.length}건`);
    for (const c of freshCandidates) console.log(`   ? ${c.onTopic ? '[주제O]' : '[주제X]'} ${c.date}  ${c.title}`);
    console.log('[dry-run] 파일을 쓰지 않고 종료합니다.');
    return;
  }

  fs.mkdirSync(path.dirname(CANDIDATES_PATH), { recursive: true });
  fs.writeFileSync(CANDIDATES_PATH, JSON.stringify(candidates, null, 2) + '\n');

  // 번역 엔진은 실제로 쓸 때만 준비한다. 키가 없으면 여기서 멈추고,
  // 이미 실린 기사는 그대로 남는다 (한국어가 다른 언어 파일에 새지 않는다).
  let engine;
  let glossary;

  // Update logic for all locales
  for (const locale of locales) {
    console.log(`Processing locale: ${locale}`);
    const filePath = path.join(__dirname, `../messages/${locale}.json`);
    let fileJson;
    try {
      fileJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      console.error(`Missing ${locale}.json`);
      continue;
    }

    if (locale === 'ko') {
      fileJson.News.articles = finalArticles;
    } else {
      // Reuse translations that already exist for this locale (keyed by link) so only
      // new or changed articles hit the translation API.
      const existingByLink = new Map();
      for (const a of ((fileJson.News && fileJson.News.articles) || [])) {
        if (a.link) existingByLink.set(a.link, a);
      }

      // 1단계: 이미 번역된 것과 새로 번역할 것을 가른다.
      // 재사용 조건은 **한국어 원문이 그대로일 때**뿐이다. 원문을 sourceTitle/sourceSummary 에
      // 함께 저장해 두어, 나중에 한국어를 고치면 그 기사만 다시 번역된다.
      const slots = [];
      const pending = [];
      for (const article of finalArticles) {
        const prev = existingByLink.get(article.link);
        const sourceUnchanged =
          prev &&
          prev.sourceTitle === article.title &&
          prev.sourceSummary === article.summary;
        if (sourceUnchanged) {
          slots.push({ ...prev, date: article.date });
        } else {
          slots.push(null);
          pending.push({ slot: slots.length - 1, article, prev });
        }
      }

      // 2단계: 남은 것을 묶어서 번역한다. 기사당 4개 필드를 한 번에 보내고,
      // 기사 10건씩 나눠 호출한다 (한 번에 너무 많이 넣으면 응답이 잘린다).
      const FIELDS = ['category', 'title', 'summary', 'thumbnailAlt'];
      if (pending.length && !engine) {
        ({ engine, glossary } = await loadTranslator());
      }
      for (let i = 0; i < pending.length; i += 10) {
        const group = pending.slice(i, i + 10);
        console.log(`Translating ${group.length} article(s) for ${locale}...`);
        // 빈 값은 보내지 않는다 — 요약이 비어 있는 기사가 많고, 빈 문자열을 번역시키면
        // 엔진이 엉뚱한 말을 채워 넣을 수 있다.
        const refs = [];
        const strings = [];
        for (const { slot, article } of group) {
          for (const field of FIELDS) {
            const value = (article[field] || '').trim();
            if (!value) continue;
            // 표에 있는 분류는 번역시키지 않는다 (위 CATEGORY_LABELS 주석 참고)
            if (field === 'category' && CATEGORY_LABELS[value]?.[locale]) continue;
            refs.push({ slot, field });
            strings.push(value);
          }
        }

        try {
          const { translations } = strings.length
            ? await engine.translate({ strings, locale, glossary })
            : { translations: [] };

          const bySlot = new Map();
          refs.forEach((ref, index) => {
            if (!bySlot.has(ref.slot)) bySlot.set(ref.slot, {});
            bySlot.get(ref.slot)[ref.field] = translations[index];
          });

          for (const { slot, article } of group) {
            const fields = bySlot.get(slot) || {};
            slots[slot] = {
              date: article.date,
              category: CATEGORY_LABELS[article.category]?.[locale] || fields.category || '',
              title: fields.title || '',
              summary: fields.summary || '',
              thumbnailAlt: fields.thumbnailAlt || '',
              link: article.link,
              sourceTitle: article.title,
              sourceSummary: article.summary,
            };
          }
        } catch (e) {
          console.error(`Translation error for ${locale}:`, e.message);
          translationFailed = true;
          for (const { slot, article, prev } of group) {
            if (prev) {
              // 이전 번역을 유지한다 — 한국어로 되돌리지 않는다.
              slots[slot] = { ...prev, date: article.date };
            } else {
              // 비한국어 파일에 한국어를 쓰지 않는다: 이번에는 그 기사를 빼고,
              // 다음 실행에서 다시 시도한다. (언어별 기사 수가 어긋나면
              // check:blugene 이 오류로 잡는다.)
              console.error(`  -> skipping "${article.title}" in ${locale}.json (no previous translation)`);
            }
          }
        }
      }

      fileJson.News.articles = slots.filter(Boolean);
    }

    fs.writeFileSync(filePath, JSON.stringify(fileJson, null, 2) + "\n");
    console.log(`Updated ${locale}.json`);
  }
}

updateNews()
  .then(() => {
    if (translationFailed) {
      console.error('Some articles could not be translated. Existing translations were kept and untranslated articles were skipped.');
      process.exitCode = 1;
    } else {
      console.log('Done!');
    }
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
