
import { randomUUID } from "crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                email: { label: "Email", type: "email"}
            },
            async authorize(credentials): Promise<null | { id: string, name: string, email: string }> {

                if (credentials?.email === "admin@admin.fr" && credentials.password === "admin") {
                    return { id: randomUUID(), name: "Admin", email: "admin@admin.fr" };
                }
                
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",   
      },
      callbacks: {
        session: async ({session }) => {
            // make api call to retrieve user information we want to expose in session
            return {
                ...session,
                user: {
                    ...session.user,
                    role: ["read:planning"],
                    image: "https://github.com/shadcn.png",
                    firstname: "Admin",
                    lastname: "Admin",                
                }
            };
        },
      },
    pages: {
        signIn: "/login"
    }
}

