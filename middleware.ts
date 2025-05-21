import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";
import { isAdmin } from "./utils/supabase/utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const client = await createClient();

  if(pathname.startsWith('/api/admin')) {
    if (!isAdmin(client)) {
      return Response.redirect('/')
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/redirect_oauth|api/auth_callback).*)",  
  ],
};
