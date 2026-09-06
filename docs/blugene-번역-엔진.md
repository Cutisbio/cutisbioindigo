# 번역 엔진 — 구조와 비교 방법

## 왜 이 구조인가

이 사이트는 **번역본을 미리 만들어 두고 정적 페이지로 굽습니다.** 방문자가 언어를 바꿀 때
번역 API 를 부르지 않습니다. API 는 운영자가 `npm run translate` 를 실행할 때만 호출됩니다.

| 시점 | API 호출 |
|---|---|
| 방문자가 언어 전환 | **없음** — 이미 만들어진 페이지로 이동 |
| 빌드 | **없음** — `messages/*.json` 을 읽어 66개 페이지 정적 생성 |
| `npm run translate` | 한국어가 바뀐 문구만 |
| 매달 뉴스 수집 | 새로 들어온 기사만 (`scripts/update-news.js`) |

## 무엇이 다시 번역되는가

`content/translation-state.json` 이 항목마다 **번역의 근거가 된 한국어 원문의 지문**을 갖고 있습니다.

```
"Hero.title": { "en": "a1b2…", "ja": "a1b2…", ... }
```

`npm run translate` 는 현재 한국어의 지문과 기록을 비교해 **다른 것만** 번역합니다.
그래서 문구 하나를 고치면 5개 언어 × 1건만 API 를 씁니다.

기존 5개 언어 파일은 사람이 번역해 넣은 것이라, `--seed` 로 한 번 기준선을 기록해 두었습니다
(443개 항목 × 5개 언어). 그래야 **앞으로 바뀐 것만** 번역됩니다.

`npm run check:blugene` 은 한국어만 고치고 번역을 빠뜨린 항목을 경고로 알려 줍니다.

## 용어집

`content/glossary.json` 에 세 가지가 들어 있습니다.

| 항목 | 내용 |
|---|---|
| `terms` | 인디고 · 아닐린 · 견뢰도 · 불검출 등 15개 용어의 6개 언어 대응 |
| `keepAsIs` | `Blugene`, `CutisBio`, `ZDHC MRSL`, `pMC`, `mg/kg` 등 그대로 두는 표기 |
| `rules` | 지켜야 할 규칙 10가지 |

용어 대응은 **기존 6개 언어 문구에서 뽑았습니다.** 새로 지어낸 것이 아닙니다.

규칙 중 중요한 것들:

- `불검출` 을 `0` · `없음` · `무함유` 로 바꾸지 말 것. 검출한계(5 mg/kg)를 빼지 말 것
- 견뢰도 `4-5` 는 범위이지 소수가 아님. `4.5` 로 바꾸지 말 것
- `98%` 는 **바이오 기반 탄소 함량**. 순도 · 안전성 · 탄소 절감으로 옮기지 말 것
- `0 ppm` · `완전 무함유` · `탄소중립` 같은 뜻을 새로 만들지 말 것

**일반 번역 API 로는 이 규칙들을 지시할 방법이 없습니다.** 그래서 LLM 을 씁니다.

## 세 엔진 비교

```bash
npm run translate:compare
```

`content/translation-eval.json` 의 문장 24개를 **세 엔진에 똑같이** 보내고
결과를 `docs/translation-comparison.md` 에 나란히 씁니다.

| 엔진 | 파일 | 키 | 기본 모델 |
|---|---|---|---|
| Claude | `scripts/translate-engines/claude.mjs` | `ANTHROPIC_API_KEY` | `claude-opus-5` |
| OpenAI | `scripts/translate-engines/openai.mjs` | `OPENAI_API_KEY` | `gpt-4o` |
| Gemini | `scripts/translate-engines/gemini.mjs` | `GEMINI_API_KEY` | `gemini-2.5-pro` |

- 지시문은 `translate-engines/prompt.mjs` 한 곳에서 만듭니다. **세 엔진이 같은 것을 받습니다** —
  프롬프트가 다르면 비교가 성립하지 않습니다.
- 키가 없는 엔진은 건너뜁니다. 하나만 있어도 실행됩니다.
- 모델은 `ANTHROPIC_MODEL` · `OPENAI_MODEL` · `GEMINI_MODEL` 로 바꿉니다.
  계정에서 쓸 수 있는 모델 이름으로 맞추세요.
- 이 스크립트는 `messages/*.json` 을 건드리지 않습니다.

옵션: `--locale=bn` (한 언어만) · `--engines=claude,openai` · `--limit=6` (문장 줄이기)

### 무엇을 보고 고르나

평가 문장마다 **볼 것**이 적혀 있습니다. 자동 채점이 아니라 사람이 판단합니다.
**벵골어와 튀르키예어가 승부처입니다** — 영어 · 일본어 · 중국어는 어느 엔진이든 무난하고,
전문 용어가 무너지는 곳은 이 두 언어입니다.

### Google 은 왜 Gemini 인가

Claude · OpenAI 와 **같은 조건으로 겨루게** 하기 위해서입니다. 세 엔진 모두 같은 용어집과
같은 규칙을 지시받습니다.

Google 의 전용 번역 제품인 **Cloud Translation v3** 는 성격이 다릅니다. 용어집(glossary)은
있지만 "불검출을 0 으로 옮기지 마라" 같은 규칙을 지시할 방법이 없고, API 키가 아니라
GCP 서비스 계정 인증이 필요합니다. 그쪽도 비교하고 싶으면 어댑터를 하나 더 붙이면 됩니다.

**DeepL 은 후보에서 뺐습니다 — 벵골어를 지원하지 않습니다.** 품질은 좋지만
6개 언어 중 하나가 빠지면 결국 두 번째 엔진을 붙여야 합니다.

## 비용

사이트 문구는 한국어 14,595자입니다. 5개 언어 전량 번역해도 약 73,000자로,
어느 엔진이든 **한 번에 몇 백 원 수준**입니다. 실제로는 바뀐 문구만 돌리니 그보다 훨씬 적습니다.
**비용은 엔진 선택의 판단 근거가 못 됩니다. 품질과 통제력으로 고르세요.**

## 키 관리

```bash
cp .env.local.example .env.local
```

- `.env.local` 은 `.gitignore` 에 있어 GitHub 에 올라가지 않습니다.
- **이름을 `NEXT_PUBLIC_` 으로 시작하게 바꾸지 마세요.** 그러면 키가 브라우저 번들에 실려
  누구나 볼 수 있게 됩니다.
- 번역 스크립트는 로컬에서만 실행합니다. 배포된 사이트는 키를 쓰지 않습니다.
