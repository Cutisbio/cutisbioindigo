import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { ADMIN_ENABLED, UPLOAD_DIR, UPLOAD_URL_PREFIX } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** 화면에 넣을 수 있는 형식만 받는다. 확장자가 아니라 실제 MIME 으로 판단한다. */
const ALLOWED: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const MAX_BYTES = 8 * 1024 * 1024;

/** 파일명은 사용자가 고른 이름을 쓰지 않고 우리가 만든다 (경로 조작·중복 방지) */
function safeName(extension: string): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${random}${extension}`;
}

export async function POST(request: Request) {
  if (!ADMIN_ENABLED) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '사진 파일이 없습니다.' }, { status: 400 });
  }
  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: 'JPG · PNG · WebP 만 올릴 수 있습니다.' },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `사진이 너무 큽니다 (${(file.size / 1024 / 1024).toFixed(1)}MB). 8MB 이하로 줄여 주세요.` },
      { status: 400 }
    );
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const name = safeName(extension);
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), bytes);

  return NextResponse.json({
    url: `${UPLOAD_URL_PREFIX}/${name}`,
    bytes: bytes.length,
  });
}
