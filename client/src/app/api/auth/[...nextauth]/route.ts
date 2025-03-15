import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Nom d'utilisateur", type: "text" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log("Attempting to authenticate with credentials:", credentials?.username);
                    const response = await axios.post(`${API_URL}/auth/login/`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    if (response.data.access) {
                        console.log("Authentication successful, received token");
                        return {
                            id: response.data.user.id,
                            name: response.data.user.username,
                            email: response.data.user.email,
                            accessToken: response.data.access,
                            refreshToken: response.data.refresh,
                            isAdmin: response.data.user.is_staff,
                        };
                    }
                    console.log("Authentication failed: No access token received");
                    return null;
                } catch (error) {
                    console.error("Erreur d'authentification:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("JWT callback: Adding user data to token");
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.isAdmin = user.isAdmin;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session callback: Adding token data to session");
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                isAdmin: token.isAdmin,
                id: token.id,
            };
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },
    secret: process.env.NEXTAUTH_SECRET || "votre-secret-temporaire",
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 