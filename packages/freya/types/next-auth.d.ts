import NextAuth, { SessionOptions } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
        email: string,
        role: string[],
        image?: string,
        lastname: string,
        firstname: string,
    }
  }
}