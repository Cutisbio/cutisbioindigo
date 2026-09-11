import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ko', 'ja', 'en', 'fr', 'it', 'zh', 'tr'],
  defaultLocale: 'ko'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
