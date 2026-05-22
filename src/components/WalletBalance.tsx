"use client";

import { useBalance } from "@/hooks/useBalance";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  address: string;
}

export default function WalletBalance({ address }: Props) {
  const { balance, loading, error } = useBalance(address);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-1">잔액 (Kaia Kairos)</p>
      <div className="flex items-center gap-2">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : error ? (
          <span className="text-sm text-red-500">{error}</span>
        ) : (
          <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
            {balance ?? "0.0000"}
            <span className="ml-1 text-sm font-normal text-zinc-400">KAIA</span>
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-zinc-400">
        <a
          href="https://faucet.kaia.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          테스트넷 Faucet →
        </a>
      </p>
    </div>
  );
}
