import {timingSafeEqual} from 'node:crypto';
import {revalidateTag} from 'next/cache';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

const FIXED_TAGS = new Set(['menu', 'status', 'settings', 'pages']);

function authorized(header: string | null, secret: string): boolean {
  if (!header) {
    return false;
  }
  const given = Buffer.from(header);
  const expected = Buffer.from(secret);
  if (given.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(given, expected);
}

function allowedTag(tag: string): boolean {
  if (FIXED_TAGS.has(tag)) {
    return true;
  }

  return (tag.startsWith('product:') || tag.startsWith('page:')) && tag.length > tag.indexOf(':') + 1 && tag.length <= 220 && !/\s/.test(tag);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ok: false}, {status: 503});
  }
  if (!authorized(request.headers.get('x-revalidate-secret'), secret)) {
    return NextResponse.json({ok: false}, {status: 401});
  }

  const body = (await request.json().catch(() => null)) as {tags?: unknown} | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string' && allowedTag(tag)) : [];
  if (tags.length === 0) {
    return NextResponse.json({ok: false}, {status: 422});
  }

  for (const tag of tags) {
    revalidateTag(tag, {expire: 0});
  }

  return NextResponse.json({ok: true, tags});
}
