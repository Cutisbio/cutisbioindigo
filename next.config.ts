import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 리브랜딩 전에 쓰이던 경로를 같은 언어의 새 페이지로 영구 이동시킨다.
      // 전체를 홈으로 보내지 않는다.
      {
        source: '/:locale(ko|en|ja|zh|bn|tr)/tech',
        destination: '/:locale/technology',
        permanent: true,
      },
      {
        source: '/:locale(ko|en|ja|zh|bn|tr)/certifications',
        destination: '/:locale/data-certifications',
        permanent: true,
      },
      {
        source: '/:locale(ko|en|ja|zh|bn|tr)/products',
        destination: '/:locale/dyeing-printing',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
