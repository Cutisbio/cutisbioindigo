import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // eslint-config-next 기본 무시 항목
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // 이 저장소의 추가 무시 항목
    'dist/**', // 이전 Vite 템플릿의 빌드 산출물 (미니파이된 번들)
    'geo-template/**', // 템플릿 잔재
    'Blugene_Website_Brief/**', // 참고 자료 패키지 (원본 보존)
    '**/*.ps1', // PowerShell 스크립트
  ]),
  {
    // Node 에서 직접 실행하는 스크립트는 CommonJS 를 허용한다
    files: ['scripts/**/*.{js,mjs}', 'inject_contact.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]);

export default eslintConfig;
