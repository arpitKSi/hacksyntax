import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Use Clerk middleware only when the publishable key is provided.
// This makes local development possible without requiring Clerk env vars.
const hasPublishableKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const handler = hasPublishableKey
  ? clerkMiddleware()
  : (request: any) => {
      // noop middleware for local dev when Clerk isn't configured
      return NextResponse.next();
    };

export default handler;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "\/(api|trpc)(.*)"],
};