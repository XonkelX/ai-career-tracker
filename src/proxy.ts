export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/applications/:path*", "/resumes/:path*"],
};
