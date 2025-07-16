import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { Session, User, Role, Token } from "./types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      roles: Role[];
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    roles: Role[];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "token-verification",
      name: "Token Verification",
      credentials: {
        token: { label: "Verification Token", type: "text" },
        user: { type: "text" }, // Use 'text' as 'json' is not a valid input type
      },
      async authorize(credentials, req) {
        // Add req parameter
        if (!credentials?.token || !credentials?.user) {
          return null;
        }
        console.log(req);

        try {
          const userData = JSON.parse(credentials.user);
          // Ensure all required fields are present
          if (!userData.id || !userData.token) {
            console.error("Missing required user data: id or token");
            return null;
          }
          return {
            id: userData.id.toString(), // Ensure id is a string
            name: userData.name ?? "",
            email: userData.email ?? null,
            image: userData.image ?? null,
          } as User;
        } catch (error) {
          console.error("Token verification error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "firebase-google",
      name: "Firebase Google",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials, req) {
        // Add req parameter
        console.log(req);
        if (!credentials?.idToken) {
          return null;
        }
        try {
          // TODO: Implement Firebase Google authentication
          // Example with Firebase Admin SDK
          /*
          const decodedToken = await admin.auth().verifyIdToken(credentials.idToken)
          if (!decodedToken.uid) {
            console.error('Invalid Firebase ID token')
            return null
          }
          return {
            id: decodedToken.uid,
            token: credentials.idToken,
            name: decodedToken.name ?? null,
            email: decodedToken.email ?? null,
            image: decodedToken.picture ?? null,
          } as User
          */
          return null; // Placeholder until implemented
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("API error:", error.response?.status);
          } else {
            console.error("Auth error:", error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = ["staff"] as Role[];
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roles: ["staff"] as Role[],
        };
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & Partial<Token>;
    }) {
      if (token) {
        session.user = {
          id: token.id || "",
          name: token.user?.name || session.user?.name || "",
          email: token.user?.email || session.user?.email || "",
          image: token.user?.image || session.user?.image,
          roles: token.roles as Role[],
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
};
