import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongoClient";
import { connectDB } from "./mongodb";
import Otp from "./models/Otp";

/** Emails that are auto-assigned the "admin" role */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase().trim());
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email as string)?.toLowerCase()?.trim();
          const otp = credentials?.otp as string;

          if (!email || !otp || otp.length !== 6) return null;

          await connectDB();

          // Find a valid OTP
          const otpRecord = await Otp.findOne({
            email,
            code: otp,
            expiresAt: { $gt: new Date() },
          });

          if (!otpRecord) return null;

          // Prevent brute force: max 5 attempts
          if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return null;
          }

          // Increment attempt counter (in case authorize is called again)
          await Otp.updateOne(
            { _id: otpRecord._id },
            { $inc: { attempts: 1 } }
          );

          // OTP is valid — delete it
          await Otp.deleteOne({ _id: otpRecord._id });

          // Find or create user
          const client = await clientPromise;
          const db = client.db();
          let user = await db.collection("users").findOne({ email });

          if (!user) {
            const role = isAdminEmail(email) ? "admin" : "user";
            const result = await db.collection("users").insertOne({
              email,
              emailVerified: new Date(),
              name: email.split("@")[0],
              role,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            user = {
              _id: result.insertedId,
              email,
              name: email.split("@")[0],
              role,
            };
          } else if (!user.role) {
            // Back-fill role for existing users
            const role = isAdminEmail(email) ? "admin" : "user";
            await db.collection("users").updateOne(
              { _id: user._id },
              { $set: { role } }
            );
            user.role = role;
          }

          return {
            id: user._id.toString(),
            email: user.email as string,
            name: (user.name as string) || email.split("@")[0],
            image: (user.image as string) || null,
            role: (user.role as "admin" | "user") || "user",
          };
        } catch (err) {
          console.error("OTP authorize error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async linkAccount({ user }) {
      // Mark email as verified when linking Google account
      const client = await clientPromise;
      const db = client.db();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.collection("users").updateOne(
        { _id: user.id as any },
        { $set: { emailVerified: new Date() } }
      );
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role ?? "user";
      }

      // On first sign-in via OAuth, fetch role from DB
      if (user && !user.role && token.email) {
        const client = await clientPromise;
        const db = client.db();
        const dbUser = await db.collection("users").findOne({ email: token.email });
        if (dbUser) {
          if (!dbUser.role) {
            const role = isAdminEmail(token.email) ? "admin" : "user";
            await db.collection("users").updateOne(
              { _id: dbUser._id },
              { $set: { role } }
            );
            token.role = role;
          } else {
            token.role = dbUser.role as "admin" | "user";
          }
        }
      }

      // Allow session updates (e.g. after profile change)
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | null;
        session.user.role = (token.role as "admin" | "user") || "user";
      }
      return session;
    },
  },
});
