import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "b6tr8b1681d6tr8bdt6hbtr8nd1yt6nn86dtrb6dt8yhb6dtr8bdtrbrt6b8rdhd85t46s5bet6tj8gfbd",
});


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - login (the login page itself)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|favicon.png|images).*)",
  ],
};
