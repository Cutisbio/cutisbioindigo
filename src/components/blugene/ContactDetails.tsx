import { getTranslations } from 'next-intl/server';
import { contact } from '@/data/blugene/evidence';

/**
 * 연락처(이메일 · 전화 · 주소).
 *
 * 문의 폼(SampleInquiry) 안에 있던 것을 떼어 냈다. 폼이 있는 왼쪽 열이 길어져 버튼과
 * 안내문이 첫 화면 밖으로 밀려나 있었고, 오른쪽 지도 아래는 680px 이 비어 있었다.
 * '찾아오시는 길'과 성격이 같은 정보이므로 지도와 한곳에 둔다.
 *
 * 값은 카탈로그 p.11-12 를 옮긴 `evidence.ts` 하나에서만 온다 — 화면에서 새로 쓰지 않는다.
 */
export default async function ContactDetails({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Inquiry' });

  return (
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

      {/* 주소는 넣지 않는다 — 이 목록 바로 위(지도 앞)의 Contact.addressDetail 이 이미
          현지어와 로마자 주소를 함께 보여 준다. 목록에 다시 넣으면 같은 주소가
          500px 안에서 두 번 읽힌다. 푸터에 한 번 더 있으므로 페이지 전체로는 두 번이다. */}
    </dl>
  );
}
