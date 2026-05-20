"use client";

import Image from "next/image";
import type { Session } from "next-auth";

interface Props {
  session: Session;
}

const PROVIDER_LABEL: Record<string, string> = {
  kakao: "카카오",
  naver: "네이버",
};

export default function UserProfile({ session }: Props) {
  const { user } = session;
  const provider = (session.user as { provider?: string }).provider;
  const label = provider ? PROVIDER_LABEL[provider] ?? provider : "";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 shadow-sm">
      {user.image ? (
        <Image
          src={user.image}
          alt="프로필"
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {user.name?.[0] ?? "?"}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {user.name ?? user.email}
        </span>
        {label && (
          <span className="text-xs text-zinc-400">{label} 계정으로 로그인</span>
        )}
      </div>
    </div>
  );
}
