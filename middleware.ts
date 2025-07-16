import { NextResponse, NextRequest } from "next/server";
import { ROLE_ROUTES, Role } from "./lib/constants/route-permission";
import { getToken } from "next-auth/jwt";

declare global {
  interface NextAuthToken {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      roles: Role[];
    };
  }
}

// Public routes that don't require authentication
const publicRoutes: string[] = [
  "/login",
  "/auth/error",
  "/auth/unauthorized",
  "/",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log incoming request
  console.log("Middleware: Incoming request", {
    url: request.url,
    method: request.method,
    pathname,
    headers: Object.fromEntries(request.headers.entries()),
  });

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    console.log("Middleware: Public route, allowing access", { pathname });
    return NextResponse.next();
  }

  // Get token from request using JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users to sign-in
  if (!token) {
    console.log("Middleware: Unauthenticated user, redirecting to sign-in", {
      pathname,
    });
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Type guard to ensure token has user property
  if (!("user" in token)) {
    console.log("Middleware: Invalid token format, redirecting to sign-in", {
      pathname,
    });
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Type assertion for the token
  const typedToken = token as unknown as NextAuthToken;
  const userRoles = typedToken.user.roles || [];

  // Validate roles
  const validRoles = Object.keys(ROLE_ROUTES) as Role[];
  const validUserRoles = userRoles.filter((role): role is Role =>
    validRoles.includes(role),
  );

  // Log invalid roles for debugging
  const invalidRoles = userRoles.filter((role) => !validRoles.includes(role));
  if (invalidRoles.length) {
    console.warn("Middleware: Invalid roles detected", {
      invalidRoles,
      userId: typedToken.user.id,
      email: typedToken.user.email,
    });
  }

  // Log authenticated user details
  console.log("Middleware: Authenticated user", {
    userId: typedToken.user.id,
    email: typedToken.user.email,
    roles: validUserRoles,
    currentPath: pathname,
  });

  // If no valid roles, log out the user
  if (!validUserRoles.length) {
    console.log("Middleware: No valid roles, logging out user", {
      userId: typedToken.user.id,
      roles: userRoles,
      currentPath: pathname,
    });
    const signOutUrl = new URL("/api/auth/signout", request.url);
    signOutUrl.searchParams.set("callbackUrl", "/login");
    return NextResponse.redirect(signOutUrl);
  }

  // Get the current path without the (protected-routes) prefix
  const currentPath = pathname.replace("/(protected-routes)", "");

  // Check if user has access to this exact route
  const hasAccess = validUserRoles.some((role: Role) => {
    const routes = ROLE_ROUTES[role];
    return routes.some((route) => route === currentPath);
  });

  if (!hasAccess) {
    console.log("Middleware: Unauthorized access attempt", {
      userId: typedToken.user.id,
      email: typedToken.user.email,
      roles: validUserRoles,
      currentPath,
      allowedRoutes: validUserRoles.flatMap((role) => ROLE_ROUTES[role]),
    });

    // Redirect to unauthorized page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Middleware: Access granted", {
    userId: typedToken.user.id,
    email: typedToken.user.email,
    roles: validUserRoles,
    currentPath,
    allowedRoutes: validUserRoles.flatMap((role) => ROLE_ROUTES[role]),
  });

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
