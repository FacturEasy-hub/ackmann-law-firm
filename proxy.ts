import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except static assets, API routes, Next.js internals,
  // and root-level metadata route conventions (icon/apple-icon have no
  // dot in their request path, so the dot-extension exclusion above
  // doesn't catch them — without this they 307 to a nonexistent
  // /<locale>/apple-icon and 404).
  matcher: ["/((?!api|trpc|_next|_vercel|apple-icon|icon|.*\\..*).*)"],
};
