import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, defaultLang } from '@/i18n';

const localizedPathnames: Record<string, string> = {
  '/': '/',
  '/blog': '/blog',
  '/projects': '/projects',
  '/about': '/about',
  '/contact': '/contact',
};

function getLangFromPath(pathname: string): string | null {
  const pathWithoutSlash = pathname.slice(1);
  const firstSegment = pathWithoutSlash.split('/')[0];
  if (firstSegment && firstSegment in languages) {
    return firstSegment;
  }
  return null;
}

function getPathWithoutLang(pathname: string): string {
  const lang = getLangFromPath(pathname);
  if (lang) {
    return pathname.slice(lang.length + 1) || '/';
  }
  return pathname;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const lang = getLangFromPath(pathname);

  if (!lang) {
    const acceptLanguage = request.headers.get('accept-language');
    let detectedLang = defaultLang;

    if (acceptLanguage) {
      const preferredLang = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim())
        .find((lang) => languages[lang as keyof typeof languages]);

      if (preferredLang && preferredLang in languages) {
        detectedLang = preferredLang;
      }
    }

    const newPath = `/${detectedLang}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};