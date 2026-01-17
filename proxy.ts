import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
  // Protect only dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Exclude Clerk auth routes explicitly
    '/((?!_next|sign-in|sign-up|.*\\.(?:css|js|png|jpg|jpeg|svg|ico|webp|woff2?|ttf)).*)',
  ],
}

