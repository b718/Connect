import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Metadata = {
  role: string;
};

// Generalized protected routes
const protectedRoutes = createRouteMatcher(["/(.*)"]);

// Define routes that require the student role
const studentRoutes = createRouteMatcher(["/student(.*)"]);

// Define routes that require the teacher role
const teacherRoutes = createRouteMatcher(["/teacher(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (protectedRoutes(request)) {
    await auth.protect();
  }

  const { userId, sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata as Metadata;
  const homeUrl = new URL("/", request.url);

  if (studentRoutes(request) && userId && userRole.role !== "STUDENT") {
    return NextResponse.redirect(homeUrl);
  }

  if (teacherRoutes(request) && userId && userRole.role !== "TEACHER") {
    return NextResponse.redirect(homeUrl);
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
