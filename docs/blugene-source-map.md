# Blugene 출처 맵 — 카탈로그 12쪽 → 웹 구현 위치

원본: `Blugene_Website_Brief/source/CutisBio_CB_Bioindigo_Catalogue_(EN)_July 2026.pdf`
(SHA-256 `b3d2ccf64de191d5be84dc98a2f84bea32b4f2319fd86553f066d572264f1761`, 12쪽, 2026-07 발행)
자료 기준일: **2026-09-06**

이 문서는 카탈로그의 각 쪽이 사이트 어디에 어떤 형태로 쓰였는지, 그리고 **의도적으로 싣지 않은 항목과 그 이유**를 기록한다.
웹 자산은 `scripts/build-blugene-assets.py` 가 원본에서 생성하며, 생성 결과는 `public/blugene/asset-manifest.json` 에 원본 경로와 함께 남는다.

---

## 페이지별 대응표

| PDF 쪽 | 내용 | 구현 위치 (URL) | 컴포넌트 | 웹 자산 |
|---|---|---|---|---|
| 1 | 가족·데님·자연 표지 이미지 | `/`, `/brand` | `BlugeneHero`, `brand/page.tsx` | `brand/hero-family-denim.webp` (1732×870), `brand/hero-family-denim-1200.webp` |
| 1 | CutisBio 로고 | 데이터로 보관 (화면에는 기존 `/logo.png` 사용) | — | `brand/cutisbio-wordmark.png` |
| 1 | OEKO-TEX / OK biobased 로고 | 화면에는 쓰지 않음 (아래 '인증 마크' 참조) | — | — |
| 2 | 네 가지 인디고 합성 경로 (Figure 1-1) | `/technology` | `technology/page.tsx` | `technology/four-production-routes.png` |
| 2 | 탄소 순환 비교 (Figure 1-2) | `/technology` | `technology/page.tsx` | `technology/carbon-pathways.png` |
| 3 | C14 바이오 기반 탄소 그래프 (Figure 1-3) | `/data-certifications#test-results` | `EvidenceTables`, 원본 확대 | `evidence/biobased-carbon-chart.png` |
| 3 | C14 표 (Table 1-1) | `/data-certifications#test-results`, 홈 증거 스트립 | `EvidenceStrip`, `EvidenceTables` | `evidence/biobased-carbon-table.png` |
| 4 | 작업 환경 삽화 (Figure 2-1) | `/technology` | `technology/page.tsx` | `technology/worker-safety.png` |
| 4 | 규제·인증 허용한도 표 (Table 2-1, 2-2) | **미게재** — 아래 "공개하지 않은 항목" 참조 | — | — |
| 5 | 아닐린·N-메틸아닐린 그래프·표 (Figure 2-2, Table 2-3) | `/` (요약 차트), `/data-certifications#test-results` (전체 표) | `ImpurityEvidence`, `ComparisonChart`, `EvidenceTables` | `evidence/aniline-results.png` |
| 6 | 원단 9개 염색 사진 (Figure 3-1) | `/`, `/dyeing-printing#dyeability` | `FabricComparison` | `performance/fabric-comparison.webp`, `performance/fabric-strip.webp` |
| 6 | 견뢰도 표 4종 (Table 3-1 ~ 3-4) | `/dyeing-printing#colorfastness` | `FastnessTables` (HTML 표로 재구현) | `performance/fastness-tables.png` (원본 대조용) |
| 7 | 농도별 견본 (Figure 4-1) | `/`, `/dyeing-printing#shades` | `ShadeLibrary` | `shades/swatch-A1…B6.png` (12개, 무변환 복사), `shades/concentration-shades.webp` |
| 7 | 인디고/인디루빈 비교 (Figure 4-2) | `/`, `/dyeing-printing#shades` | `ShadeLibrary` | `shades/indirubin-indigo-100.webp`, `indirubin-indigo-94.webp` |
| 8 | 분말 제품 | `/`, `/dyeing-printing#products` | `ProductFormats` | `products/powder.png` |
| 8 | 염색 횟수 3×4 비교 (Figure 5-1) | `/`, `/dyeing-printing#products` | `ProductFormats` | `products/powder-ink-cycles.png` |
| 9 | 디지털 프린팅 잉크 | `/`, `/dyeing-printing#products` | `ProductFormats` | `products/ink-jar.png` |
| 9 | 잉크 제조 흐름 (Figure 6-1) | `/`, `/dyeing-printing#printing` | `PrintingGallery` (HTML 플로우 + 원본 이미지) | `printing/ink-process.png` |
| 9 | 프린팅 결과 두 쌍 (Figure 6-2) | `/`, `/dyeing-printing#printing` | `PrintingGallery` | `printing/pair-a-original.webp`, `pair-a-printed.webp`, `pair-b-original.webp`, `pair-b-printed.webp` |
| 10 | ZDHC 인증서 | `/data-certifications#certifications`, `/blog/sustainable-indigo` | `CertificationLibrary` | `certifications/zdhc-certificate.png` |
| 10 | OEKO-TEX ECO PASSPORT 인증서 | 같음 | `CertificationLibrary` | `certifications/oeko-certificate.png` |
| 11 | USDA BioPreferred 인증서 | 같음 | `CertificationLibrary` | `certifications/usda-certificate.png` |
| 11 | OK biobased 인증서 | 같음 | `CertificationLibrary` | `certifications/okbiobased-certificate.png` |
| 11 | 제품 요약 (제품명 · CAS 482-89-3) | `/brand`, `/dyeing-printing#products` | `brand/page.tsx`, `ProductFormats` | — (텍스트 데이터) |
| 12 | 가치사슬 개념 이미지 | `/` 환경 섹션 | `EnvironmentSection` | `brand/value-chain.webp` |
| 12 | 연락처 | 푸터 · `/contact` · 최종 CTA | `SiteFooter`, `SampleInquiry`, `FinalCta` | — (텍스트 데이터) |
| 1–12 | 전체 쪽 미리보기 · 원본 PDF | `/data-certifications#catalogue` | `CatalogueViewer` | `catalogue/page-01…12.webp`, `catalogue/*.pdf` |

---

## 공개하지 않은 항목과 이유

| 항목 | 출처 | 제외 이유 |
|---|---|---|
| 국가별 규제 허용한도 표 (Table 2-1) | p.4 | 국가·제품군마다 적용 범위와 최신 개정이 달라 원문 확인이 필요하다. 수치 대신 "여러 인증 기준이 허용 농도를 제한한다"는 일반 설명으로 대체했다. (`Technology.impurityBody`, `Impurity.context`) |
| 인증별 아닐린 허용한도 표 (Table 2-2) | p.4 | 위와 같음. 표에 적힌 `ZDHC MRSL v3.0` 은 보유 인증서의 `v3.1` 과 판이 달라, 그대로 옮기면 오해를 부른다. |
| 디지털 프린팅의 물·폐기물 절감 범위 (80~90%) | p.9 | 일반적인 디지털 프린팅 기술에 대한 서술이며 Blugene 제품으로 측정한 값이 아니다. 수치 없이 특징만 서술하고, 그 사실을 화면에 명시했다 (`Printing.advantagesNote`). |
| `100% Bio-based` (p.8 문구) | p.8 | p.3 의 실측값 98% 를 정량 표시의 기준으로 삼았다. 두 값을 같이 쓰면 상충한다. |
| 인디루빈의 약리 활성 서술 | p.7 | 염료의 피부 효능으로 오인될 수 있다. 색조 조절·제품개발 관점만 다루고 그 사실을 명시했다 (`ShadeLibrary.medicalNote`). |
| `BioIndigo ensures a hazardous chemical-free workspace` (p.4) | p.4 | 작업자 안전에 대한 정량 근거가 없다. "취급 물질의 차이"라는 서술로 완화했다 (`Technology.safetyBody`). |
| 마케팅 배너 이미지 (`Liquid Blue, Instant Impact`, `Equal Results, Better Naturally`) | p.8 | 글자가 구워진 이미지다. 텍스트를 이미지로 굽지 않는 원칙에 따라 사용하지 않았다. |
| p.7 xref109 (인디루빈 조절 노브 아이콘) | p.7 | 장식 아이콘이며 `p07-indigo-indirubin-comparison.png` 도판 안에 이미 포함되어 있다. |

## 저장소에 원래 있던 자료의 처리

| 자료 | 처리 | 이유 |
|---|---|---|
| `public/test.png` (일본어 라벨 염색 비교) | `/dyeing-printing#colorfastness` 에 **별도 사례**로 보존 (`AdditionalDyeingCase`) | 실제 사진이지만 시험기관·시험법·일자·의뢰처가 저장소에 없다. 카탈로그 p.6 시험과 섞지 않고, 원문에 인쇄된 라벨(4·6·8回染め / バイオ②-1 · 合成 · バイオ②-2)만 그대로 옮겼다. 기존의 "일본 프리미엄 업체 시험에서 더 뛰어남이 입증" 문구는 근거가 없어 삭제했다. |
| BBC · Forbes · VOGUE · WIRED · FastCompany · TechCrunch 로고 스트립 | **삭제** (`PartnersPress` 컴포넌트 제거) | 저장소에 해당 매체의 실제 기사·협업 근거가 없다. 코드상 변수명도 `DUMMY_LOGOS` 였다. |
| CEO 인터뷰 형식 인용문 (`Partners.testimonial`) | **삭제** | 출처가 확인되지 않는 인용문이다. |
| `public/jeanforest.mp4` (14.9 MB Hero 배경 영상) | Hero 에서 제거 (파일은 저장소에 남김) | 초기 로딩을 무겁게 하고, 카탈로그 p.1 이미지로 브랜드 서사를 더 정확히 전달할 수 있다. |
| `public/aniline-infographic.png` | **삭제** | 이미지에 `Bladder Cancer Risks` 헤드라인과 `cutisbio indigo: Aniline-Free & Safe` 배너가 픽셀로 인쇄되어 있었다. 방광암 귀속은 카탈로그에 근거가 없고(원문에 'bladder' 가 없다), `Aniline-Free & Safe` 는 불검출을 절대적 안전 주장으로 확대한 표현이며, 구 브랜드명이 6개 언어에 그대로 노출됐다. N-메틸아닐린 구조도 `NCH₃` 로 잘못 그려져 있었다. → 검증된 구조를 코드로 그린 `AnilineStructures.tsx` (SVG)로 대체했다. 같은 계열의 `aniline-health.png` 도 미참조 상태여서 함께 삭제했다. |
| 인증 마크 4종 (`/4ZDHC.png` 등) | 인증 카드에 계속 사용 | 정식 인증 마크 파일이다. 카탈로그 내장 라벨(p10-xref173 · p01-xref8 · p11-xref180)은 QR 코드와 인증번호가 섞여 있어 카드용 마크로 쓰지 않았고, 자산 생성 목록에서도 제외했다. `3OEKO-TEX® Eco Passport_logo.png` 는 URL 안정성을 위해 `oeko-tex-eco-passport-logo.png` 로 이름만 바꿨다. |
| `public/step1~4-*.jpg` (기존 4단계 사진) | 사용 중지 (파일은 남김) | 출처가 확인되지 않는 이미지다. 4단계 설명은 코드로 그린 SVG 개념도(`ProductionPathway`)로 대체했다. |
| `/ko/blog/sustainable-indigo`, `/ko/news`, `/ko/about`, `/ko/contact` | **URL 그대로 유지** | 기존에 색인된 주소를 깨뜨리지 않는다. 내용만 Blugene 기준으로 갱신했다. |

## 자산 생성 규칙

- 생성 스크립트: `scripts/build-blugene-assets.py` (`npm run assets:blugene`)
- 색·글자 정보가 중요한 자료(원단 사진, 색상 견본, 인증서, 표)는 PNG 무손실 또는 WebP q95 로 저장한다.
- 색보정·자동 대비·채도 강화·AI 업스케일링을 적용하지 않는다. 리샘플링은 **축소만** 한다(LANCZOS).
- 원본보다 크게 늘리지 않는다. 농도 견본 12개는 아예 변환하지 않고 원본을 그대로 복사한다.
- 결과는 `public/blugene/asset-manifest.json` 에 `원본 경로 · 픽셀 크기 · 바이트`로 기록된다.

## 알려진 원본 자료 문제

- `Blugene_Website_Brief/assets/catalogue/figures/p12-bioindigo-value-chain.png` 은 **0바이트**다.
  대신 같은 도판의 내장 이미지 `embedded/p12-xref184.png` (784×258)를 사용했다.
- OEKO-TEX 인증서 이미지는 2쪽 중 1쪽이며, 적용 제품 목록이 담긴 별첨(enclosure)은 카탈로그에 없다.
  따라서 적용 제품 범위를 특정하지 않고 그 사실을 화면에 표시한다.
- `±3%(절대값)` 정밀도 각주는 p.11 원본에서 **USDA Certified Biobased Product 라벨 아래**에 있다.
  OK biobased 인증서 본문에는 이 문구가 없다. 처음에는 OK biobased 설명에 잘못 붙어 있었고 6개 언어에서 바로잡았다.
- p.3 Table 1-1 의 Company H 열은 시험성적서 번호가 `SBED25-00000153-1` 이면서 시험일자는 `July 11, 2025` 다
  (다른 `-153-1` 행의 `May 22` 와 다르다). **원본 그대로** 옮겼다.
- p.3 Figure 1-3 은 Company Z 의 바이오 기반 탄소를 `N.D.` 로 표기하지만 Table 1-1 은 `0` (pMC 0.30) 으로 적는다.
  사이트의 표는 Table 1-1 값을 쓰고, 그 차이를 표 아래에 밝혀 둔다.
