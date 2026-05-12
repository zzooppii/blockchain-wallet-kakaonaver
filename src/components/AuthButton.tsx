"use client";

import { signIn, signOut } from "next-auth/react";
import { usePrivy } from "@privy-io/react-auth";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  isLoggedIn: boolean;
}

export default function AuthButton({ isLoggedIn }: Props) {
  const { ready } = usePrivy();

  if (!ready) return <LoadingSpinner />;

  if (isLoggedIn) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-zinc-200 px-6 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
      >
        로그아웃
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => signIn("kakao", { callbackUrl: "/" })}
        className="rounded-full bg-[#FEE500] px-8 py-3 text-sm font-semibold text-zinc-900 hover:bg-yellow-300 transition-colors"
      >
        카카오로 시작하기
      </button>
      <button
        onClick={() => signIn("naver", { callbackUrl: "/" })}
        className="rounded-full bg-[#03C75A] px-8 py-3 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
      >
        네이버로 시작하기
      </button>
    </div>
  );
}
