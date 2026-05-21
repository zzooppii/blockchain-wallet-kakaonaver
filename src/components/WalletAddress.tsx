"use client";

import { useState } from "react";

interface Props {
  address: string;
}

export default function WalletAddress({ address }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-1">지갑 주소</p>
      <div className="flex items-center justify-between gap-3">
        <a
          href={`https://baobab.klaytnscope.com/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title={address}
        >
          {short}
        </a>
        <button
          onClick={copy}
          className="text-xs px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
    </div>
  );
}
