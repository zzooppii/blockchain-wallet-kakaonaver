import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrivyProviderWrapper from "@/lib/privy/Provider";
import SessionProvider from "@/components/SessionProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { I18nProvider } from "@/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaiWallet — 카카오/네이버 연동 블록체인 지갑",
  description:
    "카카오 또는 네이버 계정으로 로그인해 Kaia 블록체인 지갑을 생성하고 관리하세요. 개인 키 관리 불필요.",
  keywords: ["카카오", "네이버", "블록체인", "지갑", "Kaia", "Privy", "Web3"],
  openGraph: {
    title: "KaiWallet",
    description: "카카오 · 네이버로 쉽게 사용하는 블록체인 지갑",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaiWallet",
    description: "카카오 · 네이버로 쉽게 사용하는 블록체인 지갑",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <SessionProvider>
          <PrivyProviderWrapper>
            <I18nProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </I18nProvider>
          </PrivyProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
