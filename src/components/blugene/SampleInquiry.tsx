'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import SectionHeading from '@/components/blugene/SectionHeading';
import SourceNote from '@/components/blugene/SourceNote';
import { contact, productSummary } from '@/data/blugene/evidence';
import { inquiryTopics, type InquiryTopic } from '@/data/blugene/shades';

/**
 * 샘플 · 기술자료 문의 폼.
 *
 * 설계 원칙
 * - 이 화면은 **어떤 정보도 외부로 전송하지 않는다.** 서버도 API 도 없고 fetch/XHR 을 쓰지 않는다.
 *   버튼은 사용자의 기본 이메일 프로그램을 mailto 로 열어 주기만 하며,
 *   실제 발송은 사용자가 자신의 메일 클라이언트에서 직접 확인한 뒤에 이루어진다.
 *   그래서 "문의가 전송되었습니다" 같은 완료 문구를 절대 표시하지 않고,
 *   대신 무슨 일이 일어나는지 설명하는 안내(submitHint)를 버튼 아래 항상 띄워 둔다.
 * - 연락처(이메일 · 전화 · 주소)와 샘플 제공 안내는 제공 카탈로그 p.11-12 의 값을
 *   `@/data/blugene/evidence` 에서 그대로 가져온다. 화면에서 새로 만들어 내지 않는다.
 * - 문의 유형 목록은 `@/data/blugene/shades` 의 `inquiryTopics` 를 단일 출처로 삼는다.
 * - 색상 라이브러리에서 `?shade=A4` 로 넘어온 경우(initialShade) 문의 유형을
 *   '색상 공동개발' 로 미리 맞추고, 어떤 견본이 메일에 담기는지 화면에 먼저 보여 준다.
 */

/** 문의 유형 코드 → messages/ko.json 의 Inquiry 네임스페이스 키 */
const TOPIC_LABEL_KEYS: Record<InquiryTopic, string> = {
  fabricDyeing: 'topicFabricDyeing',
  digitalPrinting: 'topicDigitalPrinting',
  shadeDevelopment: 'topicShadeDevelopment',
  technicalData: 'topicTechnicalData',
};

export default function SampleInquiry({ initialShade }: { initialShade?: string }) {
  const t = useTranslations('Inquiry');
  const tCommon = useTranslations('Common');

  const groupName = useId();
  const messageId = useId();
  const hintId = useId();

  // 견본 코드를 들고 들어온 방문자는 대개 색상 공동개발 문의다.
  const [topic, setTopic] = useState<InquiryTopic>(
    initialShade ? 'shadeDevelopment' : inquiryTopics[0],
  );
  const [message, setMessage] = useState('');

  const topicLabel = t(TOPIC_LABEL_KEYS[topic]);

  /** 기본 이메일 프로그램을 열어 수신자 · 제목 · 본문을 채운다 (네트워크 요청 없음). */
  function handleOpenMailClient(): void {
    const lines: string[] = [t('mailIntro'), '', t('mailTopicLine', { topic: topicLabel })];

    if (initialShade) {
      lines.push(t('mailShadeLine', { shade: initialShade }));
    }

    const written = message.trim();
    if (written) {
      lines.push('', written);
    }

    lines.push('', t('mailFooter'));

    const subject = encodeURIComponent(t('mailSubject', { topic: topicLabel }));
    const body = encodeURIComponent(lines.join('\n'));

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="max-w-2xl">
      <SectionHeading headingLevel="h2" title={t('title')} body={t('body')} />

      {initialShade && (
        <p className="mt-8 border-l-2 border-[color:var(--color-denim)] bg-[var(--color-ivory)] px-4 py-3 text-sm leading-relaxed font-medium break-keep text-[var(--color-indigo-deep)]">
          {t('mailShadeLine', { shade: initialShade })}
        </p>
      )}

      {/* 문의 유형 — 라디오 그룹 */}
      <fieldset className="mt-10 min-w-0 border-0 p-0">
        <legend className="text-sm font-semibold break-keep text-[var(--color-indigo-deep)]">
          {t('topicLabel')}
        </legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {inquiryTopics.map((item) => {
            const selected = item === topic;
            return (
              <label
                key={item}
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm break-keep transition-colors ${
                  selected
                    ? 'border-[color:var(--color-indigo-deep)] bg-white font-semibold text-[var(--color-indigo-deep)]'
                    : 'border-[color:var(--color-washed)] text-[var(--color-ink)] hover:border-[color:var(--color-denim)]'
                }`}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={item}
                  checked={selected}
                  onChange={() => setTopic(item)}
                  className="h-4 w-4 shrink-0 accent-[var(--color-indigo-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)]"
                />
                {t(TOPIC_LABEL_KEYS[item])}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 자유 입력 — 선택 사항 */}
      <div className="mt-8">
        <label
          htmlFor={messageId}
          className="block text-sm font-semibold break-keep text-[var(--color-indigo-deep)]"
        >
          {t('messageLabel')}
        </label>
        <textarea
          id={messageId}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          placeholder={t('messagePlaceholder')}
          className="mt-3 w-full rounded-md border border-[color:var(--color-washed)] bg-white px-4 py-3 text-base leading-[1.85] break-keep text-[var(--color-ink)] placeholder:text-[var(--color-slate-muted)] focus-visible:border-[color:var(--color-denim)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-denim)]"
        />
      </div>

      {/* 제출 — 폼 전송이 아니라 메일 작성기를 여는 버튼이다 */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleOpenMailClient}
          aria-describedby={hintId}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-indigo-deep)] px-6 py-3 text-sm font-semibold break-keep text-white transition-colors hover:bg-[var(--color-denim)]"
        >
          {t('submit')}
          <span aria-hidden="true">→</span>
        </button>
        <p
          id={hintId}
          className="mt-4 text-[0.8125rem] leading-relaxed break-keep text-[var(--color-slate-muted)]"
        >
          {t('submitHint')}
        </p>
      </div>

      {/* 연락처 — 카탈로그 p.11-12 */}
      <dl className="mt-10 grid gap-x-8 gap-y-1 border-t border-[color:var(--color-washed)] pt-8 sm:grid-cols-[auto_1fr] sm:gap-y-3">
        <dt className="text-sm font-semibold break-keep text-[var(--color-slate-muted)]">
          {t('emailLabel')}
        </dt>
        <dd className="mb-3 text-base break-all text-[var(--color-ink)] sm:mb-0">
          <a
            href={`mailto:${contact.email}`}
            className="font-medium text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {contact.email}
          </a>
        </dd>

        <dt className="text-sm font-semibold break-keep text-[var(--color-slate-muted)]">
          {t('telLabel')}
        </dt>
        <dd className="mb-3 text-base text-[var(--color-ink)] sm:mb-0">
          <a
            href={`tel:${contact.telHref}`}
            className="font-medium text-[var(--color-denim)] underline underline-offset-4 hover:text-[var(--color-indigo-deep)]"
          >
            {contact.tel}
          </a>
        </dd>

        <dt className="text-sm font-semibold break-keep text-[var(--color-slate-muted)]">
          {t('addressLabel')}
        </dt>
        <dd className="text-base leading-relaxed break-keep text-[var(--color-ink)]">
          {contact.address}
        </dd>
      </dl>

      {/* Blugene 과 CutisBio 의 관계 · 샘플 안내 */}
      <div className="mt-10 rounded-md border border-[color:var(--color-washed)] bg-[var(--color-ivory)] p-5 sm:p-6">
        <h3 className="text-base font-semibold break-keep text-[var(--color-indigo-deep)]">
          {t('companyRelationTitle')}
        </h3>
        <p className="mt-3 text-sm leading-[1.9] break-keep text-[var(--color-ink)]/85">
          {t('companyRelationBody')}
        </p>
        <SourceNote className="mt-4">{t('sampleNote')}</SourceNote>
        <SourceNote className="mt-1">
          {tCommon('sourceLabel')} · {tCommon('cataloguePage', { page: productSummary.page })}
        </SourceNote>
      </div>
    </div>
  );
}
