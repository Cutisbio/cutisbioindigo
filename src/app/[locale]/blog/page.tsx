import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const tTech = await getTranslations({ locale, namespace: 'Tech' });

  const posts = [
    {
      slug: 'sustainable-indigo',
      category: t('categoryTech'),
      title: tTech('title'),
      summary: tTech('description'),
      date: '2026-04-07',
      readTime: t('readTime', { minutes: 5 }),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-900 py-24 sm:py-32 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-800/40 border border-blue-700/40 text-blue-300 text-sm font-semibold tracking-widest uppercase">
            {t('eyebrow')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1] break-keep">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-medium break-keep">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Blog Post Grid */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Color accent bar */}
                <div className="sm:w-2 h-2 sm:h-auto bg-gradient-to-b from-blue-500 to-indigo-600 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none flex-shrink-0" />

                <div className="flex flex-col justify-between p-8 sm:p-10 flex-1 gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase">
                        {post.category}
                      </span>
                      <span className="text-slate-400 text-sm">{post.date}</span>
                      <span className="text-slate-400 text-sm">·</span>
                      <span className="text-slate-400 text-sm">{post.readTime}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight break-keep group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed break-keep line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    <span>{t('readMore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
