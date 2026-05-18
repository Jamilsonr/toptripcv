import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnRegister = nextUrl.pathname.startsWith("/register");
      let isOnLogin = nextUrl.pathname.startsWith("/login");
      let isOnChat = nextUrl.pathname.startsWith("/chat");
      let isOnProfile = nextUrl.pathname.startsWith("/profile");
      let isOnApi = nextUrl.pathname.startsWith("/api");

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnRegister || isOnLogin) {
        return true; // Always allow access to register and login pages
      }

      if (isOnChat || isOnProfile || isOnApi) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
