import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ko', 'ja', 'zh', 'bn', 'tr'],
  defaultLocale: 'ko'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
