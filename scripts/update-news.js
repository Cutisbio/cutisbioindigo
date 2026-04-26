const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const translate = require('google-translate-api-x');

const parser = new Parser();
const searchUrl = 'https://news.google.com/rss/search?q=%ED%81%90%ED%8B%B0%EC%8A%A4%EB%B0%94%EC%9D%B4%EC%98%A4&hl=ko&gl=KR&ceid=KR:ko';

const locales = ['ko', 'en', 'ja', 'zh', 'tr', 'bn'];
const targetLanguages = {
  'en': 'en',
  'ja': 'ja',
  'zh': 'zh-CN',
  'tr': 'tr',
  'bn': 'bn'
};

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

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateNews() {
  console.log('Fetching RSS feed...');
  let feed;
  try {
    feed = await parser.parseURL(searchUrl);
  } catch (err) {
    console.error('Error fetching RSS:', err);
    feed = { items: [] };
  }

  // Get RSS items
  const rssItems = feed.items || [];
  let newKoArticles = [];

  for (let item of rssItems) {
    const titleMatch = item.title.lastIndexOf(' - ');
    const cleanTitle = titleMatch > -1 ? item.title.substring(0, titleMatch) : item.title;
    
    // Filter out articles about "아르큐티스" (Arcutis)
    if (cleanTitle.includes('아르큐티스') || (item.contentSnippet && item.contentSnippet.includes('아르큐티스'))) {
      continue;
    }

    const pubDate = new Date(item.pubDate);
    const dateStr = pubDate.toISOString().split('T')[0];

    newKoArticles.push({
      date: dateStr,
      category: "보도자료",
      title: cleanTitle,
      summary: "큐티스바이오에 관한 최근 언론 보도입니다. 상세 내용은 링크를 확인해 주세요.",
      thumbnailAlt: "News thumbnail",
      link: item.link
    });
  }

  // Merge with hardcoded to always have at least 4 articles
  const mergedArticles = [...newKoArticles];
  for (let hc of hardcodedNews) {
    if (!mergedArticles.find(a => a.link === hc.link || a.title === hc.title)) {
      mergedArticles.push(hc);
    }
  }

  // Pick top 4 sorted by date roughly
  mergedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  const finalArticles = mergedArticles.slice(0, 4);

  // Update logic for all locales
  for (const locale of locales) {
    console.log(`Processing locale: ${locale}`);
    const filePath = path.join(__dirname, `../messages/${locale}.json`);
    let fileJson;
    try {
      fileJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      console.error(`Missing ${locale}.json`);
      continue;
    }

    if (locale === 'ko') {
      fileJson.News.articles = finalArticles;
    } else {
      const targetLang = targetLanguages[locale];
      const translatedArticles = [];
      for (const article of finalArticles) {
        try {
          console.log(`Translating article for ${locale}...`);
          const resCategory = await translate(article.category, {to: targetLang});
          const resTitle = await translate(article.title, {to: targetLang});
          const resSummary = await translate(article.summary, {to: targetLang});
          const resThumb = await translate(article.thumbnailAlt, {to: targetLang});
          
          translatedArticles.push({
            date: article.date,
            category: resCategory.text,
            title: resTitle.text,
            summary: resSummary.text,
            thumbnailAlt: resThumb.text,
            link: article.link
          });
          await delay(1500); // Prevent translation API block
        } catch(e) {
          console.error(`Translation error for ${locale}:`, e);
          // fallback to korean
          translatedArticles.push(article);
        }
      }
      fileJson.News.articles = translatedArticles;
    }

    fs.writeFileSync(filePath, JSON.stringify(fileJson, null, 2) + "\n");
    console.log(`Updated ${locale}.json`);
  }
}

updateNews().then(() => console.log('Done!')).catch(console.error);
