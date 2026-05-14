import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js middleware: gates /admin/* routes.
 *
 * Performance: для не-admin шляхів пропускаємо весь Supabase auth flow.
 * Anonimnі користувачі на головній/каталозі взагалі не торкаються Supabase
 * middleware → економимо ~5-10ms на кожен запит.
 *
 * Для admin/* — повний flow з sessions cookie refresh.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
