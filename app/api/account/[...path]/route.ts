import {cookies} from 'next/headers';
import {NextResponse, type NextRequest} from 'next/server';
import {matchAccountRoute} from '@/lib/server/account-routes';
import {cmsRequest} from '@/lib/server/cms-client';
import {isSameOrigin} from '@/lib/server/origin';
import {SESSION_COOKIE, sessionCookieOptions} from '@/lib/server/session';

export const dynamic = 'force-dynamic';

type Context = {params: Promise<{path: string[]}>};

function error(status: number, code: string, message = '') {
  return NextResponse.json({code, message}, {status});
}

/** BFF for the customer account: allowlisted CMS calls, token kept in an httpOnly cookie. */
async function handle(request: NextRequest, {params}: Context) {
  const {path} = await params;
  const match = matchAccountRoute(path, request.method);
  if (!match) {
    return error(404, 'not_found');
  }
  if (match.kind === 'method_not_allowed') {
    return error(405, 'method_not_allowed');
  }
  if (request.method !== 'GET' && !isSameOrigin(request.headers)) {
    return error(403, 'forbidden', 'Cross-site request blocked.');
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (match.auth && !token) {
    return error(401, 'unauthenticated');
  }

  const result = await cmsRequest<Record<string, unknown>>(match.cmsPath, {
    method: request.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: request.method === 'GET' ? undefined : await request.json().catch(() => ({})),
    token: match.auth ? token : undefined,
    locale: request.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'ka',
    forwardedFor: request.headers.get('x-forwarded-for')
  });

  if (!result.ok) {
    if (result.error.status === 401 && match.auth) {
      cookieStore.delete(SESSION_COOKIE);
    }
    const {code, message, errors} = result.error;
    return NextResponse.json({code, message, ...(errors ? {errors} : {})}, {status: result.error.status});
  }

  const data = {...(result.data ?? {})};
  if (match.session === 'set' && typeof data.token === 'string') {
    cookieStore.set(SESSION_COOKIE, data.token, sessionCookieOptions());
    delete data.token;
  }
  if (match.session === 'clear') {
    cookieStore.delete(SESSION_COOKIE);
  }

  return NextResponse.json(data, {status: result.status});
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
