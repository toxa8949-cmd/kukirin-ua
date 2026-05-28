import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Канонічний домен. Усі інші хости (vercel.app, www) — 301 редірект сюди.
 * Це прибирає дублікати в Google і збирає всю SEO-вагу на одному домені.
 */
const CANONICAL_HOST = "kukirinstore.com.ua";

/**
 * Next.js middleware:
 *   1. 301 redirect з vercel.app і www.* на канонічний домен (SEO)
 *   2. gates /admin/* routes
 *
 * Performance: для не-admin шляхів пропускаємо весь Supabase auth flow.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // === 301 REDIRECT НА КАНОНІЧНИЙ ДОМЕН ===
  // Спрацьовує для:
  //   - kukirin-ua-gpbw.vercel.app (старий технічний домен)
  //   - www.kukirinstore.com.ua (www-версія)
  // НЕ спрацьовує на localhost (dev) і на самому канонічному домені.
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  if (
    !isLocalhost &&
    host !== CANONICAL_HOST &&
    (host.endsWith(".vercel.app") || host === `www.${CANONICAL_HOST}`)
  ) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // === ADMIN AUTH ===
  // Швидкий шлях: будь-який не-admin запит просто проходить далі без перевірок
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Admin paths — повна перевірка auth
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml, og-image, apple-touch-icon
     * - any file with an extension (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|og-image|apple-touch-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
