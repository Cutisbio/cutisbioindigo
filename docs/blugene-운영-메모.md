# Blugene 사이트 운영 메모 (비개발자용)

무엇을 어디서 고치면 되는지만 짧게 정리했습니다. 개발 지식이 없어도 대부분 텍스트 파일 편집으로 끝납니다.
파일을 고친 뒤에는 GitHub 에 커밋하면 Netlify 가 자동으로 다시 배포합니다.

---

## 1. 문구(글) 고치기

**모든 화면 문구는 `messages/` 폴더의 6개 파일에 들어 있습니다.**

| 파일 | 언어 |
|---|---|
| `messages/ko.json` | **한국어 — 원본입니다. 여기부터 고치세요.** |
| `messages/en.json` | 영어 |
| `messages/ja.json` | 일본어 |
| `messages/zh.json` | 중국어(간체) |
| `messages/bn.json` | 벵골어 |
| `messages/tr.json` | 터키어 |

### 어디를 고쳐야 하는지 찾는 법

파일 안은 `"Hero"`, `"Impurity"` 처럼 **화면 구역 이름**으로 묶여 있습니다.

| 화면 구역 | 열쇠말(네임스페이스) |
|---|---|
| 첫 화면 큰 문구·버튼 | `Hero` |
| 첫 화면 98% / 불검출 숫자 줄 | `EvidenceStrip` |
| "우리의 일생에 닿는 옷이기에" 짙은 남색 구역 | `Manifesto` |
| "보이지 않는 것까지" 불순물 구역 | `Impurity` |
| "인디고의 DNA를, 새롭게 쓰다" 기술 구역 | `Science` |
| "입는 사람을 생각하며" 환경 구역 | `Environment` |
| 원단 비교 · 견뢰도 | `Performance`, `Fastness` |
| 색상 라이브러리 | `ShadeLibrary` |
| 분말 · 잉크 제품 | `Products` |
| 프린팅 | `Printing` |
| 데이터·인증 페이지 | `DataHub`, `Certifications` |
| 문의 화면 | `Inquiry`, `Contact` |
| 상단 메뉴 · 푸터 | `Nav`, `Footer` |
| 브랜드 페이지 | `Brand` |
| 기술 페이지 | `Technology` |
| 회사 소개 · 소식 · 블로그 | `About`, `News`, `Blog`, `Tech` |

상단 메뉴에 **항목을 넣거나 뺄 때**는 `src/data/blugene/site.ts` 의 `PRIMARY_NAV` 를 고칩니다.
같은 항목을 `FOOTER_NAV` 에도 넣으면 푸터에 두 번 나오니 주의하세요(푸터는 두 목록을 이어 붙입니다).
항목을 늘렸다면 폭이 가장 긴 언어(보통 영어·튀르키예어)에서 메뉴가 넘치지 않는지
`npm run screens` 로 확인하세요. 현재 가로 메뉴는 화면 폭 1280px 이상에서만 펼쳐집니다.

### 번역은 자동으로 됩니다

**한국어(`ko.json`)만 고치고 아래를 실행하면** 나머지 5개 언어가 채워집니다.

```bash
npm run translate
```

- **바뀐 문구만** 번역합니다. 한 줄을 고치면 그 한 줄만 API 를 씁니다.
  (`content/translation-state.json` 에 각 문구의 한국어 지문을 기록해 두고 대조합니다.)
- 무엇이 번역될지 먼저 보려면 `node scripts/translate.mjs --dry-run` — API 를 부르지 않습니다.
- 용어와 지켜야 할 규칙은 `content/glossary.json` 에 있습니다. 새 용어를 고정하고 싶으면 여기 추가하세요.
- 엔진을 바꾸려면 `node scripts/translate.mjs --engine=openai` (claude · openai · gemini).
- **API 키가 필요합니다.** `.env.local.example` 을 `.env.local` 로 복사해 채우세요.
- 뉴스 기사는 여기서 다루지 않습니다 — `scripts/update-news.js` 가 따로 번역합니다.

번역을 손으로 고쳐도 됩니다. 그때는 5개 파일의 같은 자리를 직접 고치면 됩니다.

> **방문자가 언어를 바꿀 때는 API 를 부르지 않습니다.** 6개 언어 페이지가 빌드 때 미리 만들어지고,
> 언어 전환은 이미 만들어진 페이지로 이동할 뿐입니다.

### 규칙 세 가지

1. **한국어(`ko.json`)를 먼저 고치고, `npm run translate` 를 실행하거나 나머지 5개 언어를 직접 고칩니다.**
   한 언어만 고치면 배포가 막힙니다(키가 어긋나면 검사에서 걸립니다).
   한국어만 고치고 번역을 안 하면 `npm run check:blugene` 이 경고로 알려 줍니다.
2. `{page}`, `{code}`, `{date}` 처럼 **중괄호로 감싼 부분은 그대로 두세요.** 프로그램이 값을 채웁니다.
3. 큰따옴표 `"` 와 쉼표 `,` 를 지우지 마세요. 문장 안에서 큰따옴표를 쓰려면 `“ ”` 같은 둥근 따옴표를 쓰세요.

> 고친 뒤 확인: 터미널에서 `npm run check:blugene` 을 실행하면 빠진 언어·잘못된 문구를 알려 줍니다.

---

## 2. 수치 · 시험 결과 고치기

**숫자는 문구 파일이 아니라 `src/data/blugene/` 폴더에 있습니다.** (언어와 무관하게 공통으로 쓰입니다.)

| 파일 | 담긴 내용 |
|---|---|
| `evidence.ts` | 98% 바이오 기반 탄소, 아닐린·N-메틸아닐린 불검출, 9개 시판 샘플 비교값, 시험기관·시험법·성적서 번호·시험일자, 연락처 |
| `fastness.ts` | 견뢰도 4개 표(세탁·일광·마찰·땀)의 모든 등급, 원단 샘플 #1~#9 대응 |
| `certifications.ts` | 인증 4종의 번호·기관·유효기간·적용 제품 |
| `shades.ts` | 색상 견본 목록, 제품명, 잉크 제조 단계, 프린팅 이미지 쌍 |
| `site.ts` | 도메인, 언어 목록, 상단 메뉴 구성 |

### 절대 하면 안 되는 것

- **불검출을 `0` 으로 바꾸지 마세요.** `ND` 라고 적혀 있어야 합니다.
- **견뢰도 등급 `'4-5'` 를 `4.5` 로 바꾸지 마세요.** 원본 표기 그대로여야 합니다.
- 낮은 등급(예: 마찰 견뢰도의 `1`, `2`)을 지우지 마세요. 일부러 그대로 싣고 있습니다.
- 카탈로그에 없는 숫자를 새로 만들지 마세요.

이 규칙들은 `npm run check:blugene` 이 자동으로 검사합니다. 어기면 배포가 멈춥니다.

### 자주 쓰는 작업: 인증서 갱신

`src/data/blugene/certifications.ts` 에서 해당 인증의 `validFrom` / `validUntil` / `issuedOn` 날짜를 고칩니다.
새 인증서 이미지를 받았다면 `public/blugene/certifications/` 아래 같은 파일명으로 덮어쓰고
`certificateSize` 의 가로·세로 픽셀도 함께 고칩니다.

> **가장 가까운 일정: OEKO-TEX ECO PASSPORT 문서상 유효기한 2026-10-31**

---

## 3. 사진 바꾸기

| 하고 싶은 일 | 방법 |
|---|---|
| 카탈로그 사진을 다시 만들고 싶다 | `Blugene_Website_Brief/assets/catalogue/` 의 원본을 바꾼 뒤 `npm run assets:blugene` 실행 |
| 새 사진을 추가하고 싶다 | 파일을 `public/blugene/` 아래 알맞은 폴더에 넣고, `scripts/build-blugene-assets.py` 의 목록에도 추가 |
| 첫 화면 큰 사진을 바꾸고 싶다 | `public/blugene/brand/hero-family-denim.webp` 를 교체 (가로 1732px 권장, 200~350KB) |
| 사진 설명(alt)을 고치고 싶다 | `messages/*.json` 의 `...Alt` 로 끝나는 항목 |
| **CutisBio 로고를 바꾸고 싶다** | `public/brand/cutisbio-logo.svg`(밝은 배경용)와 `cutisbio-logo-white.svg`(어두운 배경용) **두 파일을 함께** 교체. 가로세로비가 달라지면 `src/components/blugene/Wordmark.tsx` 의 `SCALE` 숫자도 조정 |
| 로고 크기를 키우거나 줄이고 싶다 | `src/components/blugene/Wordmark.tsx` 의 `SCALE` (sm/md/lg 글자 크기 — 앞의 마크는 글자 크기를 따라 같이 커진다) |
| 로고 마크의 색 순환을 바꾸고 싶다 | `src/app/globals.css` 의 `.blugene-mark` — 색값은 `--mark-*` 변수, 순서 · 간격은 `@keyframes blugene-mark-cycle` |
| 로고 마크 모양을 바꾸고 싶다 | `Blugene_Website_Brief/assets/brand/blugene-symbol-color-variations.jpg` 를 새 시트로 바꾸고 `node scripts/extract-blugene-mark.mjs` 실행 → `public/brand/blugene-mark.png` 가 다시 만들어진다. 시트 배치가 다르면 스크립트의 `REGION` 을 맞춘다 |

**주의**: 원단·색상 견본·인증서 사진에는 색보정을 하지 마세요. 색 자체가 근거 자료입니다.
그리고 **글자를 이미지에 넣지 마세요** — 번역도 안 되고 검사도 통과하지 못합니다.

---

## 4. 소식(뉴스)

`/ko/news` 의 기사 목록은 **매달 1일** GitHub Actions 가 자동으로 수집·번역합니다
(`.github/workflows/monthly-news-update.yml` → `scripts/update-news.js`).

### 무엇을 검색하나

회사 이름과 주제어를 **짝지어** 4번 검색하고 결과를 합칩니다.

| 검색어 |
|---|
| 큐티스바이오 인디고 |
| 큐티스바이오 염료 |
| 큐티스바이오 데님 |
| 큐티스바이오 패션 |

주제를 바꾸려면 `scripts/update-news.js` 위쪽의 `NEWS_TOPICS` 를 고칩니다.

### 무엇이 바로 실리고, 무엇이 승인을 기다리나

| | 조건 | 어디로 |
|---|---|---|
| **바로 실림** | 제목·요약에 `큐티스바이오` 또는 `CutisBio` 가 있음 | `/ko/news` 에 자동 노출 |
| **승인 대기** | 회사명이 없음 | `content/news-candidates.json` 에 쌓임 |

왜 이렇게 나눴는지: Google News 는 **요약을 주지 않습니다.** 요약 자리에 본문 대신
"제목 + 매체명"이 들어오고, 기사 링크도 자바스크립트로 넘어가는 구글 중간 페이지라
본문을 읽을 수도 없습니다. 그래서 "회사명과 주제어가 둘 다"라는 조건은 실질적으로
"헤드라인 한 줄에 둘 다"가 되어 버리는데, 실제 기사 헤드라인은 큐티스바이오 대신
파트너 브랜드(르캐시미어, 코오롱FnC)를 씁니다. 실측하니 19건 중 0건이 통과했습니다.
**기계가 확인할 수 있는 것만 자동으로 싣고, 나머지는 사람이 고릅니다.**

### 후보 승인하는 법 — 관리자 화면 (권장)

터미널에서 아래를 실행하고, 브라우저에서 **http://localhost:3000/admin** 을 엽니다.

```bash
npm run dev
```

| 탭 | 할 수 있는 일 |
|---|---|
| **기사 검토** | 후보 기사를 체크해서 승인 → `승인 상태 저장` → `소식란에 반영하기` |
| **직접 쓰기** | 유튜브 영상 링크 올리기, 사진 + 글 쓰기, 쓴 글 수정·내리기 |

- 기본은 **인디고·염료·데님·염색 기사만 보기** 입니다. 체크를 풀면 전체가 나옵니다.
- `승인 상태 저장` 은 승인 표시만 저장합니다. 실제로 소식란에 실으려면 이어서
  **`소식란에 반영하기`** 를 누르세요 (새 기사를 5개 언어로 번역하느라 1~2분 걸립니다).
- 직접 쓴 글은 **저장 즉시** 소식 페이지에 나옵니다. 따로 반영할 필요가 없습니다.
- 글을 쓸 때 한국어를 입력하고 **`나머지 5개 언어 번역`** 을 누르면 나머지가 채워집니다.
  번역이 어색하면 `언어별 입력 펼치기` 로 직접 고치세요. **6개 언어가 다 차야 저장됩니다.**
- 사진은 JPG · PNG · WebP, 8MB 이하. `public/blugene/news/` 에 저장됩니다.

> **이 화면은 내 컴퓨터에서만 열립니다.** 배포된 사이트에서 `/admin` 은 404 입니다
> (로그인 기능이 없어서, 열어 두면 누구나 소식란을 고칠 수 있습니다).
> **고친 내용은 GitHub 에 커밋해야 실제 사이트에 올라갑니다.**

### 후보 승인하는 법 — 파일 직접 고치기

관리자 화면을 쓰지 않아도 됩니다. `content/news-candidates.json` 을 열면 이런 항목이 줄지어 있습니다.

```json
{
  "date": "2024-08-20",
  "title": "르캐시미어, 친환경 염색 '아쿠아인디고'로 프리뷰인서울 2024 참가 눈길",
  "approved": false,
  "onTopic": true
}
```

- **`"approved": false` 를 `true` 로 바꾸면** 다음 실행 때 소식란에 실리고 5개 언어로 번역됩니다.
- `"onTopic": true` 는 인디고·염료·데님·염색 기사라는 표시입니다. **이것부터 보세요.**
  목록도 승인된 것 → 주제 관련 → 나머지 순으로 정렬돼 있습니다.
- 실린 기사를 다시 내리려면 `true` 를 `false` 로 되돌리면 됩니다.
- **아무것도 삭제되지 않습니다.** 안 실리는 기사도 이 파일에 그대로 남아 있어 언제든 되살릴 수 있습니다.
- 고친 뒤에는 `node scripts/update-news.js` 를 실행해야 소식란에 반영됩니다.

### 직접 쓴 소식은 어디에 저장되나

`content/news-posts.json` 입니다. **자동 수집 기사와 파일이 따로입니다** —
수집 스크립트가 매달 `messages/*.json` 의 기사 목록을 통째로 다시 쓰기 때문에,
같은 곳에 두면 직접 쓴 글이 지워집니다.

주제어(`TOPIC_RE`)나 회사명 표기(`COMPANY_RE`)를 바꾸려면 `scripts/update-news.js` 위쪽을 고칩니다.

### 바꾸기 전에 확인하는 법

검색어나 조건을 고친 뒤에는 아래를 실행하세요.
**무엇이 실릴지만 보여 주고 파일도, 번역 API 도 건드리지 않습니다.**

```bash
node scripts/update-news.js --dry-run
```

### 그 밖에

- 손으로 고칠 일은 거의 없습니다.
- 번역이 실패하면 **이전 번역을 유지하거나 그 기사를 건너뜁니다.** 한국어가 다른 언어 화면에 새지 않습니다.
- 직접 기사를 추가하려면 `scripts/update-news.js` 위쪽의 `hardcodedNews` 목록에 넣으세요.
- **분류 배지**(보도자료 · 제품출시 · 업무협약 · 공동연구)는 번역시키지 않고
  `CATEGORY_LABELS` 표에 고정해 두었습니다. 매번 번역에 맡겼더니 같은 `보도자료` 가
  벵골어에서 세 가지로 갈렸습니다. 분류를 새로 만들면 이 표에도 5개 언어를 채워 넣으세요.
- 자동 수집 기사는 **요약이 없습니다.** Google News 가 본문 대신 "제목 + 매체명" 을 주기 때문에
  수집 단계에서 비웁니다(화면은 요약이 없으면 그 줄을 그리지 않습니다).
  요약을 넣고 싶은 기사는 `hardcodedNews` 에 직접 써 주세요.

> **GitHub Actions 에 키를 넣어야 매달 자동 실행이 됩니다.**
> 저장소 → Settings → Secrets and variables → Actions → New repository secret →
> 이름 `OPENAI_API_KEY`. 넣지 않으면 새 기사만 번역되지 않고 그 단계가 실패로 표시됩니다
> (이미 실린 기사는 그대로 남아 사이트는 깨지지 않습니다).
- 이미 실린 기사는 검색 결과에서 사라져도 그대로 남습니다(Google News 는 최근 것만 돌려줍니다).
  빼고 싶은 기사가 있으면 `messages/*.json` 의 `News.articles` 에서 **6개 언어 모두** 지워야 합니다.
- 자동 수집 기사의 요약은 Google News 가 본문 대신 "제목 + 매체명" 을 주는 탓에
  제목과 거의 같습니다. 중요한 기사는 `hardcodedNews` 에 요약을 직접 써 넣는 편이 낫습니다.

---

## 5. 문의 메일

문의 화면의 버튼은 **방문자의 이메일 프로그램을 열 뿐**이고, 이 사이트가 정보를 대신 전송하지 않습니다.
그래서 "문의가 전송되었습니다" 같은 문구를 쓰지 않습니다.

- 받는 주소를 바꾸려면 `src/data/blugene/evidence.ts` 의 `contact.email`
- 메일 제목·본문 문구는 `messages/*.json` 의 `Inquiry.mail...` 항목

---

## 6. 도메인

현재 설정은 **`blugene.co`** 기준입니다 (`www.blugene.co` 는 자동으로 `blugene.co` 로 이동).

- 도메인을 바꾸려면 Netlify 환경변수 `NEXT_PUBLIC_BASE_URL` 을 고치세요 (`netlify.toml` 에 기본값이 있습니다).
- 이전 도메인 `cutisbioindigo.kr` → `blugene.co` 자동 이동은 **아직 꺼 두었습니다.**
  준비되면 `netlify.toml` 아래쪽 주석을 풀어 주세요. 지금은 두 도메인이 같은 내용을 보여 주고,
  검색엔진에는 `blugene.co` 가 원본이라고 알려 줍니다.

---

## 7. 배포 전 확인 명령

터미널에서 프로젝트 폴더를 열고 순서대로 실행합니다.

```bash
npm run check:blugene
```

```bash
npm run build
```

`build` 는 `check:blugene` 을 먼저 자동 실행합니다.
`✗` 표시가 나오면 그 내용을 고쳐야 배포됩니다. `!` (경고)는 배포를 막지 않지만 확인이 필요한 사항입니다.

화면을 눈으로 확인하려면:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/ko` 를 엽니다.

---

## 8. 문제가 생겼을 때

### 로컬 미리보기에서 **모든 페이지가 404**로 나온다

증상: `npm run dev` 는 정상적으로 뜨는데, 화면을 열면 헤더·푸터도 없이
"요청하신 페이지를 찾을 수 없습니다 / The page you requested was not found." 만 나옵니다.
터미널에는 `GET /ko/about 404` 처럼 찍히고, `Compiling ...` 줄은 나오지 않습니다.

원인: `.next` 폴더(개발 중 만들어지는 임시 폴더)의 캐시가 깨진 것입니다.
Next 16 은 개발 캐시를 `.next/dev/cache/turbopack` 에 계속 저장해 두는데,
이 프로젝트 폴더가 OneDrive 동기화 폴더 안에 있어서 캐시 파일이 어긋나는 일이 생깁니다.
(`next dev` 가 띄우는 `⚠ Slow filesystem detected` 경고가 같은 이야기입니다.)
**소스 코드 문제가 아니므로 코드를 고칠 필요가 없습니다.**

해결: 개발 서버를 끄고(터미널에서 `Ctrl + C`) 아래를 실행합니다.
`.next` 를 지우고 다시 띄우는 명령입니다. 지워도 되는 폴더이니 안심하세요.

```bash
npm run dev:clean
```

처음 한 번은 화면이 뜨기까지 1~2분 걸릴 수 있습니다. 그 뒤로는 평소처럼 `npm run dev` 를 쓰면 됩니다.

> 재발을 줄이려면 OneDrive 설정에서 이 프로젝트의 `.next` 와 `node_modules` 폴더를
> 동기화 대상에서 제외하세요. 두 폴더 모두 지워도 다시 만들어지는 임시 폴더라 백업할 필요가 없습니다.

### 배포된 사이트에서 특정 페이지만 404 로 나온다

이때는 캐시 문제가 아니라 주소가 실제로 없는 경우입니다.
`src/data/blugene/site.ts` 의 `PRIMARY_NAV` · `FOOTER_NAV` 에 적은 주소와
`src/app/[locale]/` 아래 폴더 이름이 같은지 확인하세요
(예: `/about` 항목은 `src/app/[locale]/about/page.tsx` 가 있어야 합니다).

---

## 9. 함께 볼 문서

| 문서 | 내용 |
|---|---|
| `docs/blugene-source-map.md` | 카탈로그 12쪽의 어떤 자료가 사이트 어디에 쓰였는지, 무엇을 왜 뺐는지 |
| `docs/blugene-claims.md` | 근거 있는 사실 / 브랜드 표현 / 확인이 필요한 항목의 구분 — **새 문구를 쓰기 전에 꼭 보세요** |
| `docs/blugene-visual-assets.md` | 모든 이미지의 출처·성격·alt |
| `docs/blugene-validation.md` | 이번 작업에서 실제로 검증한 내용과 남은 확인 항목 |
| `docs/blugene-번역-엔진.md` | 번역이 언제 어떻게 돌아가는지, 엔진 세 가지 비교 방법 |
