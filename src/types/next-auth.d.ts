import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    privyJwt?: string;
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    providerAccountId?: string;
    privyJwt?: string;
  }
}
