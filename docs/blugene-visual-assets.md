# Blugene 시각자료 대장

자료 기준일: **2026-09-06**
자산 생성: `npm run assets:blugene` (`scripts/build-blugene-assets.py`)
생성 결과 목록: `public/blugene/asset-manifest.json` (원본 경로 · 픽셀 크기 · 바이트)

이 문서는 사이트에 쓰인 모든 시각자료를 **네 가지 성격**으로 구분한다.
화면에도 같은 구분이 `AssetKind` 배지(시험 사진 / 개념 이미지 / 브랜드 이미지 / 카탈로그 도판)로 표시된다.

| 성격 | 뜻 |
|---|---|
| **시험 사진** | 카탈로그에 수록된 실제 시험·실물 사진. 색보정 없이 크기만 조정. |
| **카탈로그 도판** | 카탈로그에 인쇄된 도표·색상 견본. 실물 촬영이 아님. |
| **개념 이미지** | 개념 설명용 삽화·합성 이미지. 실제 시설·고객·시험 결과가 아님. |
| **브랜드 이미지** | 브랜드 서사를 위한 이미지. 제품 성능이나 고객 사례가 아님. |

---

## 1. 카탈로그 원본에서 가져온 자산

모두 `Blugene_Website_Brief/assets/catalogue/` 의 원본에서 **축소(LANCZOS)만** 거쳤다.
색보정 · 자동 대비 · 채도 강화 · AI 업스케일링 · 브랜드색 오버레이를 적용하지 않았다.

| 웹 경로 | 성격 | 크기 | 출처 | 화면 alt (한국어 원본) |
|---|---|---|---|---|
| `/blugene/brand/hero-family-denim.webp` | 브랜드 이미지 | 1732×870 · 204KB | p.1 `embedded/p01-xref27.png` | 데님 재킷을 입은 보호자가 아이를 안고 옥수수밭과 초원, 물가가 보이는 풍경을 바라보는 장면 (`Hero.imageAlt`) |
| `/blugene/brand/hero-family-denim-1200.webp` | 브랜드 이미지 | 1200×603 · 123KB | 같음 | 같음 (브랜드 페이지용) |
| `/blugene/brand/og-cover.jpg` | 브랜드 이미지 | 1200×630 · 150KB | 같음 (중앙 크롭) | 링크 미리보기 전용 (화면 비노출) |
| `/blugene/brand/value-chain.webp` | 개념 이미지 | 784×258 · 59KB | p.12 `embedded/p12-xref184.png` | 원료 작물, 발효 설비, 푸른 원단, 데님을 입은 사람으로 이어지는 가치사슬 개념 이미지 (`Environment.imageAlt`) |
| `/blugene/brand/cutisbio-wordmark.png` | 브랜드 이미지 | 456×103 · 20KB | p.1 `embedded/p01-xref6.png` | 데이터로만 보관 (현재 화면에서는 기존 `/logo.png` 사용) |
| `/blugene/technology/four-production-routes.png` | 개념 이미지 | 1191×771 · 160KB | p.2 Figure 1-1 | 원유 · 바이오매스 · 인디고 식물에서 출발하는 네 가지 인디고 합성 경로 도식 (`Technology.routesAlt`) |
| `/blugene/technology/carbon-pathways.png` | 개념 이미지 | 1230×678 · 277KB | p.2 Figure 1-2 | 화학 경로와 바이오 경로의 탄소 순환을 비교한 개념도 (`Technology.carbonAlt`) |
| `/blugene/technology/worker-safety.png` | 개념 이미지 | 988×331 · 188KB | p.4 Figure 2-1 | 유해 화학물질 취급과 비유해 물질 취급을 대비해 보여 주는 삽화 (`Technology.safetyAlt`) |
| `/blugene/evidence/biobased-carbon-chart.png` | 시험 사진 | 1116×681 · 41KB | p.3 Figure 1-3 | 바이오 기반 탄소 함량 비교 그래프 원본 |
| `/blugene/evidence/biobased-carbon-table.png` | 시험 사진 | 1151×756 · 154KB | p.3 Table 1-1 | C14 시험 결과 표 원본 |
| `/blugene/evidence/aniline-results.png` | 시험 사진 | 1163×1545 · 133KB | p.5 Figure 2-2 · Table 2-3 | 아닐린 · N-메틸아닐린 분석 그래프·표 원본 |
| `/blugene/performance/fabric-comparison.webp` | 시험 사진 | 1075×376 · 53KB | p.6 Figure 3-1 (라벨 포함) | 9개 원단 견본 사진. 식물성 #1~#3, 화학 #4~#6, 바이오 #7~#9 (`Performance.fabricAlt`) |
| `/blugene/performance/fabric-strip.webp` | 시험 사진 | 1147×193 · 28KB | p.6 `embedded/p06-xref106.png` | 라벨 없는 원단 견본 원본 |
| `/blugene/performance/fastness-tables.png` | 시험 사진 | 1198×943 · 163KB | p.6 Table 3-1~3-4 | 견뢰도 표 원본 (HTML 표와 대조용) |
| `/blugene/shades/swatch-A1…B6.png` (12개) | 카탈로그 도판 | 각 193×182 전후 · 0.5KB | p.7 Figure 4-1 `embedded/p07-xref111~121` | 카탈로그 p.7 Figure 4-1 의 농도별 염색 견본 {code} (`ShadeLibrary.swatchAlt`) |
| `/blugene/shades/concentration-shades.webp` | 카탈로그 도판 | 1128×570 · 14KB | p.7 Figure 4-1 (전체) | 농도별 견본 도판 원본 |
| `/blugene/shades/indirubin-indigo-100.webp` | 시험 사진 | 517×386 · 48KB | p.7 Figure 4-2 | 인디고 100% 로 염색한 데님 원단 사진 (`ShadeLibrary.indirubinAltA`) |
| `/blugene/shades/indirubin-indigo-94.webp` | 시험 사진 | 517×386 · 54KB | p.7 Figure 4-2 | 인디고 94% · 인디루빈 6% 로 염색한 데님 원단 사진 (`ShadeLibrary.indirubinAltB`) |
| `/blugene/products/powder.png` | 시험 사진 | 290×208 · 35KB | p.9 `embedded/p09-xref164.png` | 접시에 담긴 짙은 청색 바이오 인디고 분말 (`Products.powderAlt`) |
| `/blugene/products/ink-jar.png` | 시험 사진 | 176×264 · 21KB | p.9 `embedded/p09-xref161.png` | 짙은 청색 바이오 인디고 디지털 프린팅 잉크가 담긴 유리병 (`Products.inkAlt`) |
| `/blugene/products/powder-ink-cycles.png` | 시험 사진 | 1235×1175 · 81KB | p.8 Figure 5-1 | 3행 4열 비교 도판 (화학 분말 / 바이오 분말 / 바이오 잉크 × 1~4회 염색) (`Products.cyclesAlt`) |
| `/blugene/printing/ink-process.png` | 개념 이미지 | 1363×390 · 122KB | p.9 Figure 6-1 | 원료 준비 → 프리믹싱 → 밀링 → 여과 → 제형 완성 흐름 도식 (`Printing.processAlt`) |
| `/blugene/printing/pair-a-original.webp` | 시험 사진 | 184×265 · 19KB | p.9 `embedded/p09-xref155.png` | 디지털 프린팅에 사용한 원작 이미지 1 (`Printing.pairAltOriginal`) |
| `/blugene/printing/pair-a-printed.webp` | 시험 사진 | 285×458 · 27KB | p.9 `embedded/p09-xref156.png` | 같은 이미지를 바이오 인디고 잉크로 프린팅한 결과 1 |
| `/blugene/printing/pair-b-original.webp` | 시험 사진 | 203×231 · 22KB | p.9 `embedded/p09-xref157.png` | 원작 이미지 2 |
| `/blugene/printing/pair-b-printed.webp` | 시험 사진 | 384×456 · 55KB | p.9 `embedded/p09-xref158.png` | 프린팅 결과 2 |
| `/blugene/certifications/zdhc-certificate.png` | 시험 사진 | 611×868 · 198KB | p.10 `embedded/p10-xref171.png` | ZDHC MRSL Level 1 Version 3.1 인증서 원본 이미지 |
| `/blugene/certifications/oeko-certificate.png` | 시험 사진 | 610×875 · 144KB | p.10 `embedded/p10-xref172.png` | OEKO-TEX® ECO PASSPORT 인증서 원본 이미지 (2쪽 중 1쪽) |
| `/blugene/certifications/usda-certificate.png` | 시험 사진 | 689×524 · 215KB | p.11 `embedded/p11-xref179.png` | USDA BioPreferred® 인증서 원본 이미지 |
| `/blugene/certifications/okbiobased-certificate.png` | 시험 사진 | 590×851 · 330KB | p.11 `embedded/p11-xref177.png` | TÜV AUSTRIA OK biobased 인증서 원본 이미지 |
| `/blugene/catalogue/page-01…12.webp` | 시험 사진 | 각 1000px 폭 | 카탈로그 12쪽 | CutisBio 바이오 인디고 카탈로그 {page}쪽 (`DataHub.cataloguePageAlt`) |
| `/blugene/catalogue/CutisBio-CB-Bioindigo-Catalogue-EN-2026-07.pdf` | 원본 | 1.9MB | 제공 PDF 원본 | 내려받기용 |

## 2. CutisBio 로고 (제공받은 원본 SVG)

원본: `logo_cutis_2.svg` (Adobe Illustrator 내보내기, 2026-09 제공)

| 웹 경로 | 용도 | 크기 |
|---|---|---|
| `/brand/cutisbio-logo.svg` | 밝은 배경 — 헤더 · 브랜드 페이지 락업 | viewBox 296.05 × 62.35 (약 4.75 : 1) |
| `/brand/cutisbio-logo-white.svg` | 어두운 배경 — 푸터 (딥 인디고 위) | 같음 |

원본에서 손댄 것은 두 가지뿐이며 **형태는 바꾸지 않았다.**

1. **viewBox 를 실제 그림 영역에 맞춰 잘랐다.** 원본 viewBox 는 `0 0 595.28 202.29` 인데
   실제 그림은 `x 134.47 · y 70.47 · w 295.05 · h 61.35` 영역에만 있어, 그대로 쓰면 여백이 절반을 넘어
   같은 표시 크기에서 로고가 아주 작게 보였다. 헤드리스 Chrome 의 `getBBox()` 로 실측해
   여백 0.5 를 두고 `133.97 69.97 296.05 62.35` 로 잘랐다.
2. **Illustrator 잔재인 흰색 라운드 사각형(`.st3`)을 제거했다.** 글자 위쪽(y 22~38)에 떠 있는
   흰색 도형이라 흰 배경에서는 보이지 않으면서 크롭 범위만 위로 넓혔다.

어두운 배경용 판본은 위와 같은 형태에 **색만 흰색 단색으로** 바꿨다(로고 단색 사용의 일반적인 처리).
방패 안쪽의 얇은 검정 헤어라인(`.st2`)은 흰 실루엣에서 의미가 없어 지웠다.

표시 크기는 `src/components/blugene/Wordmark.tsx` 의 `SCALE` 한 곳에서 관리한다.
로고 안에서 글자는 방패보다 낮아(약 69%) 보이므로, 글자가 읽히도록 높이를 조금 넉넉히 잡았다
(헤더 18px · 브랜드 페이지 24px · 작은 크기 13px).

> 원본 SVG 는 문자가 이미 아웃라인(패스)으로 변환되어 있어 폰트 의존성이 없다.
> 로고를 교체할 때는 두 파일을 함께 바꾸고 `Wordmark.tsx` 의 가로세로비도 확인해야 한다.

## 3. 저장소에 원래 있던 자산 중 계속 쓰는 것

| 웹 경로 | 성격 | 용도 |
|---|---|---|
| `/logo.png` | 브랜드 이미지 | 회사 소개 페이지 상단의 CutisBio 로고 (기존 래스터 파일) |
| `/4ZDHC.png`, `/oeko-tex-eco-passport-logo.png`, `/2BioPreferredLabel.PNG`, `/1okbiobased.png` | 인증 마크 | 인증 카드의 마크. 정식 인증 마크 파일이다. (`3OEKO-TEX® Eco Passport_logo.png` → 특수문자·공백 없는 이름으로 변경) |
| `/test.png` | 시험 사진 | 추가 원단 평가 사례 (일본어 라벨). 출처 미확인을 화면에 명시하고 카탈로그 시험과 분리해 표시 |
| `/favicon.svg`, `/favicon.ico` | 아이콘 | 그대로 |

## 4. 코드로 직접 그린 시각자료 (이미지 파일 없음)

모두 인라인 SVG / HTML 이며 텍스트가 이미지로 구워지지 않는다. 다국어로 번역되고 스크린리더로 읽힌다.

| 컴포넌트 | 내용 | 근거 |
|---|---|---|
| `ComparisonChart.tsx` | 시판 인디고 9개 샘플의 아닐린 · N-메틸아닐린 막대그래프. 0부터 시작하는 축, N.D. 는 막대 없이 별도 표식, 그룹(화학/식물/바이오) 구분, 아래에 실제 HTML 데이터 표 병기 | p.5 Table 2-3 |
| `ProductionPathway.tsx` | 재생 가능한 원료 → 미생물 발효 → 인디고 회수·제품화 → 원단 염색·프린팅 4단계 개념도. 선 아이콘은 장식(aria-hidden)이고 의미는 텍스트가 담당 | p.2 · p.12 |
| `EvidenceTables.tsx` | C14 · 아닐린 시험 결과 전체 표 (9개 샘플 × 시험기관·시험법·성적서 번호·일자) | p.3 Table 1-1, p.5 Table 2-3 |
| `FastnessTables.tsx` | 견뢰도 4개 표를 2단 머리글 HTML 표로 재구현. 등급 문자열('4-5')을 그대로 출력 | p.6 Table 3-1~3-4 |
| `PrintingGallery.tsx` 의 공정 플로우 | 잉크 제조 5단계. 한국어 설명과 원문 표기(`Raw Material Preparation` … `Formation`)를 나란히 표시 | p.9 Figure 6-1 |
| `AnilineStructures.tsx` | 아닐린(C₆H₅NH₂) · N-메틸아닐린(C₆H₅NHCH₃) 골격 구조식. 검증된 구조를 좌표로 계산해 SVG 로 그렸다 | p.4 서술 |
| `ThreadMotif.tsx` | 데님 실 두 가닥을 연상시키는 추상 선. **순수 장식**(aria-hidden)이며 DNA 이중나선·화학구조도·인증마크로 읽히지 않게 그렸다 | 브랜드 표현 |
| `Wordmark.tsx` | Blugene 워드마크(텍스트) + `by` + **CutisBio 로고 SVG** 락업. 서체는 `.blugene-wordmark`(globals.css), 크기는 `SCALE` 한 곳에서 관리한다 | 브랜드 표현 + 제공 로고 |

## 5. 생성형 도구로 만든 이미지

**이번 작업에서 생성형 이미지 도구로 만든 이미지는 없다.**

Master Prompt §8 의 A(세계인의 일상과 데님 보조 브랜드 사진)와 B(인디고의 DNA 추상 이미지)는
이 환경에 이미지 생성 도구가 없어 **제작하지 않았다.** 완료한 것처럼 보고하지 않는다.
대신 §8 이 허용한 대로 카탈로그 p.1 원본 이미지와 카탈로그 도판만으로 화면을 구성했고,
C(정확한 SVG 개념도)와 D(근거를 읽는 차트·색상 도구)는 위 4절과 같이 **코드로 구현**했다.

필요해지면 아래 프롬프트를 그대로 쓸 수 있다 (Master Prompt §8 원문).

<details>
<summary>A. 세계인의 일상과 데님 — 보조 브랜드 사진 (미제작)</summary>

> Create an editorial lifestyle photograph for Blugene, a biotechnology-based indigo ingredient brand. A small, naturally interacting group of adults across generations, with a range of skin tones and body types, wearing everyday denim of different washes. An understated urban courtyard in soft daylight. Candid, relaxed, real fabric texture, believable hands and anatomy, tasteful fashion editorial composition. Deep indigo, washed blue, cotton white and warm neutral tones. Wide 16:9 composition with breathing room for responsive cropping. No text, no logos, no flags, no nationality labels, no laboratory, no medical cues, no environmental performance graphics. This is a conceptual brand image, not documentation of actual customers or Blugene-dyed garments.

용도: 브랜드 선언 영역 1장. 제작하면 `AssetKind`를 '브랜드 이미지'로 표시하고, 사람 얼굴 위에 문구를 올리지 않는다.
</details>

<details>
<summary>B. 인디고의 DNA — 소재 기반 추상 이미지 (미제작)</summary>

> Create a refined conceptual textile image for Blugene. Two strands of deep indigo cotton thread gently intertwine in a loose double-helix rhythm and resolve into a detailed denim twill weave. Photorealistic fibers and tactile fabric, subtle studio daylight, cotton-ivory background, restrained premium material photography. A metaphor for biotechnology reimagining how indigo is produced, not a molecular or scientific diagram. No atoms, no molecular bonds, no DNA letters, no skin penetration, no floating scientific equations, no microbes on clothing, no text or logos. Leave generous negative space for HTML typography. Landscape 3:2 composition.

현재는 같은 역할을 `ThreadMotif.tsx` (코드로 그린 추상 선)가 대신하고 있다.
</details>

### 추가 촬영·제작 제안 (자료가 준비되면)

1. **브랜드 선언 영역의 실사 이미지** — 연령·피부색·체형이 다양한 성인들의 일상적인 데님 착장.
   국기 · 인종 이름표 · 과장된 민족 의상을 쓰지 않는다. 모바일용 세로 구도를 함께 촬영한다.
2. **제품 패키지 사진** — 분말·잉크의 실제 공급 상태. 규격이 확정되면.
3. **파트너 원단 사례** — 출처(브랜드 · 공장 · 시험조건)를 명시할 수 있는 경우에만.

## 6. 제거한 자산

| 파일 | 조치 | 이유 |
|---|---|---|
| `public/aniline-infographic.png` | **삭제** | 이미지에 `Bladder Cancer Risks` 헤드라인과 `cutisbio indigo: Aniline-Free & Safe` 배너가 픽셀로 인쇄되어 있었다. ① 방광암 귀속은 제공 카탈로그에 근거가 없고(원문에 'bladder' 가 한 번도 나오지 않는다), ② `Aniline-Free & Safe` 는 불검출을 절대적 안전 주장으로 확대한 표현이며, ③ 구 브랜드명이 6개 언어 전부에 그대로 노출됐고, ④ N-메틸아닐린 구조가 `NCH₃` 로 잘못 그려져 있었다. 텍스트가 이미지에 구워져 번역·금지어 검사·근거 규칙을 모두 우회했다. → 정확한 구조식 SVG(`AnilineStructures.tsx`)로 대체했다. |
| `public/aniline-health.png` | **삭제** | 같은 계열의 자료이며 어디에서도 참조되지 않았다. |
| `public/jeanforest.mp4` (14.9MB) | 화면에서 사용 중지 (파일은 저장소에 남김) | Hero 배경 영상이 초기 로딩을 크게 무겁게 했고, 카탈로그 p.1 이미지가 브랜드 서사를 더 정확히 전달한다. |
| `public/step1-dna-design.jpg` 외 3개 | 화면에서 사용 중지 (파일은 남김) | 출처가 확인되지 않는 이미지다. 4단계 설명은 `ProductionPathway.tsx` 개념도로 대체했다. |
| `public/cutisbio-microbe.jpg`, `dna-design.webp` | 미사용 | 현재 화면에서 참조하지 않는다. |

> 삭제한 파일은 git 이력에 남아 있으므로 필요하면 복구할 수 있다.
> 다만 위 두 인포그래픽은 **공개 URL 로 접근 가능한 상태로 두면 안 되는 내용**이라 파일 자체를 제거했다.

## 7. 이미지 사용 규칙 (유지보수용)

- 원단 · 색상 견본 · 인증서에는 `className="swatch-true-color"` 를 붙인다 (필터 · 블렌드모드 차단).
- 새 이미지를 넣을 때는 `scripts/build-blugene-assets.py` 의 `JOBS` 에 추가해
  `asset-manifest.json` 에 출처가 기록되게 한다.
- 텍스트를 이미지에 굽지 않는다. 설명은 반드시 `messages/*.json` 을 거친다.
- 사람 사진 위에 문구나 시험 완료 배지를 올리지 않는다.
- `npm run check:blugene` 이 코드가 참조하는 이미지의 존재 여부를 검사한다.
