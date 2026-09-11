#!/usr/bin/env python3
"""
Blugene 웹 자산 빌드 스크립트
=================================

`Blugene_Website_Brief/assets/catalogue/` 의 원본(카탈로그 PDF에서 추출한 이미지)을
`public/blugene/` 아래 웹 배포용 자산으로 변환한다.

원칙 (Blugene_Claude_Code_Master_Prompt.md §11)
- 색·글자 정보가 중요한 자료(원단 사진, 색상 견본, 인증서, 표)는 무손실 또는 q>=92 로 저장한다.
- 색보정 / 자동 대비 / 채도 강화 / AI 업스케일링을 적용하지 않는다. 리샘플링은 축소(LANCZOS)만 한다.
- 원본보다 큰 크기로 업스케일하지 않는다.
- 원본 파일은 Blugene_Website_Brief/ 안에 그대로 남는다.

실행:  python scripts/build-blugene-assets.py
"""

from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "Blugene_Website_Brief" / "assets" / "catalogue"
PDF_SRC = ROOT / "Blugene_Website_Brief" / "source" / "CutisBio_CB_Bioindigo_Catalogue_(EN)_July 2026.pdf"
OUT = ROOT / "public" / "blugene"

# (원본 상대경로, 출력 상대경로, 최대 폭(None=원본 유지), 포맷 옵션)
# fmt: off
JOBS: list[tuple[str, str, int | None, dict]] = [
    # --- 브랜드 -------------------------------------------------------------
    ("embedded/p01-xref27.png",                      "brand/hero-family-denim.webp",      1732, {"quality": 88}),
    ("embedded/p01-xref27.png",                      "brand/hero-family-denim-1200.webp", 1200, {"quality": 86}),
    ("embedded/p12-xref184.png",                     "brand/value-chain.webp",             784, {"quality": 92}),
    ("embedded/p01-xref6.png",                       "brand/cutisbio-wordmark.png",        456, {}),

    # --- 기술 (개념도 · 글자 포함 → PNG 무손실) -----------------------------
    ("figures/p02-four-production-routes.png",       "technology/four-production-routes.png", 1191, {}),
    ("figures/p02-carbon-pathways.png",              "technology/carbon-pathways.png",        1230, {}),
    ("figures/p04-worker-safety-illustration.png",   "technology/worker-safety.png",           988, {}),

    # --- 시험 근거 (그래프 · 표 → PNG 무손실) -------------------------------
    ("figures/p03-biobased-carbon-chart.png",        "evidence/biobased-carbon-chart.png",    1116, {}),
    ("figures/p03-biobased-carbon-table.png",        "evidence/biobased-carbon-table.png",    1151, {}),
    ("figures/p05-aniline-results.png",              "evidence/aniline-results.png",          1163, {}),

    # --- 염색 성능 (실물 사진 → 색 보존 우선, WebP q95) ---------------------
    ("figures/p06-fabric-comparison-labeled.png",    "performance/fabric-comparison.webp",    1075, {"quality": 95}),
    ("embedded/p06-xref106.png",                     "performance/fabric-strip.webp",         1147, {"quality": 95}),
    ("figures/p06-fastness-tables.png",              "performance/fastness-tables.png",       1198, {}),

    # --- 색상 라이브러리 ----------------------------------------------------
    ("figures/p07-concentration-shades.png",         "shades/concentration-shades.webp",      1128, {"quality": 95}),
    ("embedded/p07-xref134.png",                     "shades/indirubin-indigo-100.webp",       517, {"quality": 95}),
    ("embedded/p07-xref135.png",                     "shades/indirubin-indigo-94.webp",        517, {"quality": 95}),

    # --- 제품군 -------------------------------------------------------------
    ("embedded/p09-xref164.png",                     "products/powder.png",                    290, {}),
    ("embedded/p09-xref161.png",                     "products/ink-jar.png",                   176, {}),
    ("figures/p08-powder-ink-cycles.png",            "products/powder-ink-cycles.png",        1235, {}),

    # --- 프린팅 -------------------------------------------------------------
    ("figures/p09-ink-process.png",                  "printing/ink-process.png",              1363, {}),
    ("embedded/p09-xref155.png",                     "printing/pair-a-original.webp",          368, {"quality": 92}),
    ("embedded/p09-xref156.png",                     "printing/pair-a-printed.webp",           570, {"quality": 92}),
    ("embedded/p09-xref157.png",                     "printing/pair-b-original.webp",          406, {"quality": 92}),
    ("embedded/p09-xref158.png",                     "printing/pair-b-printed.webp",           768, {"quality": 92}),

    # --- 인증서 원본 (글자 판독 우선 → PNG 무손실) --------------------------
    ("embedded/p10-xref171.png",                     "certifications/zdhc-certificate.png",        611, {}),
    ("embedded/p10-xref172.png",                     "certifications/oeko-certificate.png",        610, {}),
    ("embedded/p11-xref179.png",                     "certifications/usda-certificate.png",        689, {}),
    ("embedded/p11-xref177.png",                     "certifications/okbiobased-certificate.png",  590, {}),
    # 인증 마크는 저장소에 이미 있는 정식 마크 파일(public/*.png)을 그대로 쓴다.
    # 카탈로그 내장 라벨(p10-xref173 / p01-xref8 / p11-xref180)은 QR·인증번호가 섞여 있어 카드용 마크로 쓰지 않는다.
]
# fmt: on

# 카탈로그 p.7 농도 견본. bbox(등장 위치) 순서를 보존한다 — xref116 은 A6·B1 두 위치에 반복 사용된다.
SHADE_GRID = [
    ("A1", "p07-xref121"), ("A2", "p07-xref120"), ("A3", "p07-xref119"),
    ("A4", "p07-xref118"), ("A5", "p07-xref117"), ("A6", "p07-xref116"),
    ("B1", "p07-xref116"), ("B2", "p07-xref115"), ("B3", "p07-xref114"),
    ("B4", "p07-xref113"), ("B5", "p07-xref112"), ("B6", "p07-xref111"),
]


def convert(src: Path, dst: Path, max_w: int | None, opts: dict) -> tuple[int, int, int]:
    im = Image.open(src)
    if max_w and im.width > max_w:  # 축소만, 확대 없음
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)

    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.suffix == ".webp":
        im.save(dst, "WEBP", method=6, **opts)
    else:
        im.save(dst, "PNG", optimize=True, **opts)
    return im.width, im.height, dst.stat().st_size


# 고객이 채팅으로 준 홈 「원료에서 원단까지」 4단계 사진. 카탈로그 자료가 아니며 생성 이미지로 보인다.
# 1 · 2 · 4 는 2026-09-09 고해상도 사진(2000px)에서, 3 은 같은 날 첨부한 섹션 시안(2000×1567)에서 잘라냈다.
CLIENT_IMAGES: list[tuple[str, str]] = [
    ("technology/pathway/01-feedstock.jpg",
     "고객 제공 — 2026-09-09 채팅 첨부 고해상도 사진(2000×1996)에서 시안 테두리와 01 배지를 제외하고 정사각으로 잘라냄. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/pathway/02-fermentation.jpg",
     "고객 제공 — 2026-09-09 채팅 첨부 고해상도 사진(2000×1091)에서 발효조 중심으로 정사각 잘라냄. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/pathway/03-recovery.jpg",
     "고객 제공 — 2026-09-09 채팅에 첨부한 홈 섹션 시안(2000×1567 JPEG)에서 잘라냄. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/pathway/04-fabric.jpg",
     "고객 제공 — 2026-09-09 채팅 첨부 고해상도 사진(2000×1091)에서 실 염색 라인 중심으로 정사각 잘라냄. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("brand/dermatologist-choi-wonwoo.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 인물 사진 원본(3744×5616 JPEG)을 자르지 않고 960px 폭으로 축소(WebP q86, 메타데이터 제거). 브랜드 페이지 선언 구역의 Blugene 기획자(피부과전문의 최원우) 소개"),
    ("technology/carbon/bio-biomass-tree.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: 초록 잎 나무(식물성 바이오매스). 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/carbon/fermenter.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: 발효조. 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/carbon/indigo-denim.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: 인디고 분말과 청바지. 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/carbon/co2-cloud.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: CO₂ 구름(대기). 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/carbon/fossil-oil-pump.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: 원유 채굴 펌프와 석유통. 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
    ("technology/carbon/refinery.webp",
     "고객 제공 — 2026-09-11 채팅 첨부 HTML(Blugene_Carbon_Comparison.html)의 CSS 스프라이트(WebP 1536×1024, 3×2)에서 512px 정사각으로 잘라낸 타일: 화학 공장. 기술 페이지 「탄소의 여정」 카드 삽화. 카탈로그 자료가 아니며 생성 이미지로 보임"),
]


def main() -> int:
    if not SRC.exists():
        print(f"[!] 원본 폴더가 없습니다: {SRC}", file=sys.stderr)
        return 1

    manifest: dict[str, dict] = {}

    for rel_src, rel_dst, max_w, opts in JOBS:
        s = SRC / rel_src
        if not s.exists() or s.stat().st_size == 0:
            print(f"[!] 건너뜀 (없거나 0바이트): {rel_src}")
            continue
        w, h, size = convert(s, OUT / rel_dst, max_w, opts)
        manifest[f"/blugene/{rel_dst}"] = {
            "source": f"Blugene_Website_Brief/assets/catalogue/{rel_src}",
            "width": w, "height": h, "bytes": size,
        }
        print(f"  {rel_dst:52s} {w:5d}x{h:<5d} {size//1024:5d} KB")

    # --- OG 이미지 (1200×630 JPEG) ---
    # 링크 미리보기 크롤러 중에는 WebP 를 처리하지 못하는 것이 있어 JPEG 를 함께 만든다.
    og_src = SRC / "embedded" / "p01-xref27.png"
    if og_src.exists():
        im = Image.open(og_src).convert("RGB")
        target_ratio = 1200 / 630
        w, h = im.size
        if w / h > target_ratio:            # 좌우가 넓으면 가로를 자른다
            new_w = round(h * target_ratio)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:                                # 위아래가 넓으면 세로를 자른다
            new_h = round(w / target_ratio)
            top = (h - new_h) // 2
            im = im.crop((0, top, w, top + new_h))
        im = im.resize((1200, 630), Image.LANCZOS)
        og_dst = OUT / "brand" / "og-cover.jpg"
        og_dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(og_dst, "JPEG", quality=86, optimize=True, progressive=True)
        manifest["/blugene/brand/og-cover.jpg"] = {
            "source": "Blugene_Website_Brief/assets/catalogue/embedded/p01-xref27.png",
            "width": 1200, "height": 630, "bytes": og_dst.stat().st_size,
        }
        print(f"  brand/og-cover.jpg                                    1200x630   {og_dst.stat().st_size//1024:5d} KB")

    # --- 농도 견본: 원본 그대로 복사(리샘플 없음), 등장 위치 순서로 이름 부여 ---
    for label, xref in SHADE_GRID:
        s = SRC / "embedded" / f"{xref}.png"
        d = OUT / "shades" / f"swatch-{label}.png"
        d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(s, d)
        im = Image.open(d)
        manifest[f"/blugene/shades/swatch-{label}.png"] = {
            "source": f"Blugene_Website_Brief/assets/catalogue/embedded/{xref}.png",
            "width": im.width, "height": im.height, "bytes": d.stat().st_size,
        }
    print(f"  shades/swatch-A1..B6.png  ({len(SHADE_GRID)}개, 원본 무변환 복사)")

    # --- 카탈로그 12쪽 미리보기 (지연 로딩 전용) ---
    for i in range(1, 13):
        s = SRC / "pages" / f"page-{i:02d}.png"
        if not s.exists():
            continue
        w, h, size = convert(s, OUT / "catalogue" / f"page-{i:02d}.webp", 1000, {"quality": 82})
        manifest[f"/blugene/catalogue/page-{i:02d}.webp"] = {
            "source": f"Blugene_Website_Brief/assets/catalogue/pages/page-{i:02d}.png",
            "width": w, "height": h, "bytes": size,
        }
    print("  catalogue/page-01..12.webp")

    # --- 원본 PDF ---
    if PDF_SRC.exists():
        pdf_dst = OUT / "catalogue" / "CutisBio-CB-Bioindigo-Catalogue-EN-2026-07.pdf"
        pdf_dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(PDF_SRC, pdf_dst)
        manifest["/blugene/catalogue/CutisBio-CB-Bioindigo-Catalogue-EN-2026-07.pdf"] = {
            "source": "Blugene_Website_Brief/source/" + PDF_SRC.name,
            "bytes": pdf_dst.stat().st_size,
        }
        print(f"  catalogue/*.pdf  {pdf_dst.stat().st_size//1024} KB")

    # --- 고객이 따로 준 이미지 ---
    # 카탈로그가 아니라 고객이 채팅 · 메일로 건넨 이미지는 SRC 에 원본이 없다. 이미 public/ 에
    # 들어 있는 파일을 그대로 두고 출처만 매니페스트에 남긴다 — 그래야 이 스크립트를 다시 돌려도
    # 출처 기록이 사라지지 않는다. 변환 · 색보정은 하지 않는다.
    for rel_dst, provenance in CLIENT_IMAGES:
        f = OUT / rel_dst
        if not f.exists():
            print(f"[!] 고객 제공 이미지 없음: {rel_dst}")
            continue
        im = Image.open(f)
        manifest[f"/blugene/{rel_dst}"] = {
            "source": provenance,
            "width": im.width, "height": im.height, "bytes": f.stat().st_size,
        }
        print(f"  {rel_dst:52s} {im.width:5d}x{im.height:<5d} {f.stat().st_size//1024:5d} KB  (고객 제공)")

    (OUT / "asset-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    total = sum(v.get("bytes", 0) for v in manifest.values())
    print(f"\n총 {len(manifest)}개 자산, {total/1024/1024:.2f} MB → {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
