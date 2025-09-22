import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // 👈 ton champ custom
  }

  interface Session {
    user: {
      id?: string;   // 👈 parce que tu fais `session.user.id = token.sub`
      role?: string; // 👈 ton champ custom
    } & DefaultSession["user"];
  }

  interface JWT {
    role?: string; // 👈 champ custom
  }
}
