// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

declare module 'next-auth' {
  interface Session {
    data: LoginRes
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'token-verification',
      name: 'Token Verification',
      credentials: {
        token: { label: 'Verification Token', type: 'text' },
        user: { type: 'json' },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null

        try {
          // The token is already verified we Just return the user data that was passed in here
          if (credentials.user) {
            return JSON.parse(credentials.user)
          }
          return null
        } catch (error) {
          console.error('Token verification error:', error)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'firebase-google',
      name: 'Firebase Google',
      credentials: {
        idToken: { label: 'ID Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) {
          return null
        }

        try {
          const response = await axios.get<LoginRes>(
            AUTH_ENDPOINTS.googleLogin,
            {
              params: {
                access_token: credentials.idToken,
                device_type: 'web',
              },
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          if (response.data.code === 200) {
            return response.data
          }
          return null
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Xano API error:', error.response?.status)
          } else {
            console.error('Auth error:', error)
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.data = user
      }
      return token
    },
    async session({ session, token }) {
      session.data = token.data as LoginRes
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
}
