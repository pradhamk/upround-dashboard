import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "./utils";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
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
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.redirect(new URL("/api/redirect_oauth", request.url));
  }
  
  const { data } = await supabase
                    .schema('whitelist')
                    .from('profiles')
                    .select("*")
                    .eq('email', user.user.email)
                    .limit(1)
                    .single();

  if(!data || data.id !== user.user.id) {
    await supabase.auth.signOut();
    return NextResponse.redirect('https://www.uproundvc.org/join');
  }

  if(request.nextUrl.pathname === "/admin") {
    if(!await isAdmin(supabase)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
};
