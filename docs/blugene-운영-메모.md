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

### 규칙 세 가지

1. **한국어(`ko.json`)를 먼저 고치고, 나머지 5개 언어의 같은 자리도 함께 고칩니다.**
   한 언어만 고치면 배포가 막힙니다(키가 어긋나면 검사에서 걸립니다).
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
| 로고 크기를 키우거나 줄이고 싶다 | `src/components/blugene/Wordmark.tsx` 의 `SCALE` (sm/md/lg 의 `logoW`·`logoH`) |

**주의**: 원단·색상 견본·인증서 사진에는 색보정을 하지 마세요. 색 자체가 근거 자료입니다.
그리고 **글자를 이미지에 넣지 마세요** — 번역도 안 되고 검사도 통과하지 못합니다.

---

## 4. 소식(뉴스)

`/ko/news` 의 기사 목록은 매달 GitHub Actions 가 자동으로 수집·번역합니다
(`.github/workflows/monthly-news-update.yml` → `scripts/update-news.js`).

- 손으로 고칠 일은 거의 없습니다.
- 번역이 실패하면 **이전 번역을 유지하거나 그 기사를 건너뜁니다.** 한국어가 다른 언어 화면에 새지 않습니다.
- 직접 기사를 추가하려면 `scripts/update-news.js` 위쪽의 `hardcodedNews` 목록에 넣으세요.

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

## 8. 함께 볼 문서

| 문서 | 내용 |
|---|---|
| `docs/blugene-source-map.md` | 카탈로그 12쪽의 어떤 자료가 사이트 어디에 쓰였는지, 무엇을 왜 뺐는지 |
| `docs/blugene-claims.md` | 근거 있는 사실 / 브랜드 표현 / 확인이 필요한 항목의 구분 — **새 문구를 쓰기 전에 꼭 보세요** |
| `docs/blugene-visual-assets.md` | 모든 이미지의 출처·성격·alt |
| `docs/blugene-validation.md` | 이번 작업에서 실제로 검증한 내용과 남은 확인 항목 |
