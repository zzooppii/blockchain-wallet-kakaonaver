"use client";

export interface TxRecord {
  hash: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface Props {
  transactions: TxRecord[];
}

export default function TransactionHistory({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-6 shadow-sm text-center">
        <p className="text-xs text-zinc-400">트랜잭션 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-3">트랜잭션 기록</p>
      <ul className="flex flex-col gap-2">
        {transactions.map((tx) => (
          <li
            key={tx.hash}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex flex-col min-w-0">
              <a
                href={`https://baobab.klaytnscope.com/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
                title={tx.hash}
              >
                {tx.hash.slice(0, 12)}…{tx.hash.slice(-6)}
              </a>
              <span className="text-xs text-zinc-400">
                → {tx.to.slice(0, 8)}…{tx.to.slice(-4)}
              </span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                -{tx.amount} KAIA
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(tx.timestamp).toLocaleString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
