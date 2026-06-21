/**
 * =============================================================================
 * AUTHENTICATION CONFIGURATION — NextAuth.js
 * =============================================================================
 *
 * This file configures how users sign in to the app.
 * For now, we use "Credentials" provider (email + password).
 *
 * TODO (Team Member C): You can add more providers later:
 * - Google OAuth: https://next-auth.js.org/providers/google
 * - GitHub OAuth: https://next-auth.js.org/providers/github
 *
 * HOW IT WORKS:
 * 1. User visits /api/auth/signin
 * 2. NextAuth shows a sign-in form
 * 3. User enters credentials
 * 4. We verify against MongoDB
 * 5. A session cookie is created
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";

import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // ── Providers: How users can sign in ────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "founder@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // null = sign-in failed
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD is not configured. Authentication falling back to MongoDB.");
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null; // No user found
          }

          const isValidPassword = await bcryptjs.compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null; // Invalid password
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "admin-user",
            name: "Founder Admin",
            email: adminEmail,
          };
        }

        return null; // Reject all other credential attempts
      },
    }),
  ],

  // ── Session Configuration ──────────────────────────────────────────────
  session: {
    strategy: "jwt", // Use JWT tokens (stateless, works well with Vercel)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── Callbacks: Customize session/token data ────────────────────────────
  callbacks: {
    /**
     * When a JWT token is created, add the user's MongoDB ID to it.
     * This lets us look up the user in the database from any API route.
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    /**
     * When the session is read (e.g., in a React component),
     * include the user's MongoDB ID.
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  // ── Secret: Used to encrypt tokens ─────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET || "b6tr8b1681d6tr8bdt6hbtr8nd1yt6nn86dtrb6dt8yhb6dtr8bdtrbrt6b8rdhd85t46s5bet6tj8gfbd",
};

