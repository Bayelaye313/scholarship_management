import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        isAdmin: boolean;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            accessToken: string;
            refreshToken: string;
            isAdmin: boolean;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        accessToken: string;
        refreshToken: string;
        isAdmin: boolean;
    }
} 