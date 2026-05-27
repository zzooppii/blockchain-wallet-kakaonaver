import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import { SignJWT, importPKCS8 } from "jose";

async function signPrivyJwt(sub: string): Promise<string | undefined> {
  const pem = process.env.NEXTAUTH_PRIVATE_KEY;
  if (!pem) return undefined;
  try {
    const privateKey = await importPKCS8(
      pem.replace(/\\n/g, "\n"),
      "RS256"
    );
    return await new SignJWT({ sub })
      .setProtectedHeader({ alg: "RS256", kid: "nextauth-key-1" })
      .setIssuer(process.env.NEXTAUTH_URL ?? "http://localhost:3000")
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);
  } catch {
    return undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        // Privy Custom JWT — RSA 서명 (NEXTAUTH_PRIVATE_KEY 설정 시 활성화)
        token.privyJwt = await signPrivyJwt(token.sub!);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.provider = token.provider as string | undefined;
      if (token.privyJwt) session.privyJwt = token.privyJwt as string;
      return session;
    },
  },
});
