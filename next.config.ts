import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 2026-09-11 벵골어를 뺐다. 이미 퍼진 /bn 주소는 같은 경로의 영어 페이지로 보낸다.
      { source: '/bn', destination: '/en', permanent: true },
      { source: '/bn/:path*', destination: '/en/:path*', permanent: true },
      // 리브랜딩 전에 쓰이던 경로를 같은 언어의 새 페이지로 영구 이동시킨다.
      // 전체를 홈으로 보내지 않는다.
      {
        source: '/:locale(ko|ja|en|fr|it|zh|tr)/tech',
        destination: '/:locale/technology',
        permanent: true,
      },
      {
        source: '/:locale(ko|ja|en|fr|it|zh|tr)/certifications',
        destination: '/:locale/data-certifications',
        permanent: true,
      },
      {
        source: '/:locale(ko|ja|en|fr|it|zh|tr)/products',
        destination: '/:locale/dyeing-printing',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
