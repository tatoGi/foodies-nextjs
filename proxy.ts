import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {SESSION_COOKIE} from './lib/server/session';

const intl = createMiddleware(routing);
const ACCOUNT_PATH = /^\/(ka|en)\/account(?:\/.*)?$/;

export default function proxy(request: NextRequest) {
  const {pathname, search} = request.nextUrl;
  const account = pathname.match(ACCOUNT_PATH);
  // Only a quick cookie check here; the account layout verifies the token with the CMS.
  if (account && !request.cookies.has(SESSION_COOKIE)) {
    const login = new URL(`/${account[1]}/login`, request.url);
    login.searchParams.set('next', pathname + search);
    return NextResponse.redirect(login);
  }

  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
