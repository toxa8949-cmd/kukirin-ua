import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/**
 * Refreshes the Supabase auth session cookie on every matched request and
 * is the SINGLE source of truth for /admin/* access control.
 *
 * Rules:
 *   /admin/login        — public (form). If already an admin → redirect /admin.
 *   /admin/* (others)   — admin only. If not admin → redirect /admin/login.
 *
 * Layout and pages MUST NOT add another redirect. Two checks in a row caused
 * an ERR_TOO_MANY_REDIRECTS loop because cookies set in one response are not
 * yet visible to the next middleware run.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { pathname } = request.nextUrl;

  // Only run admin checks for /admin paths. Other paths just refresh the
  // session cookie and continue.
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Already logged in as an admin? Skip the form, go to dashboard.
    if (user) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
    // Anonymous or non-admin user: show the form.
    return response;
  }

  // Other /admin/* paths: require admin.
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "not_admin");
    return NextResponse.redirect(url);
  }

  return response;
}
