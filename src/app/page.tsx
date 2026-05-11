"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePrivy, useWallets, useSubscribeToJwtAuthWithFlag } from "@privy-io/react-auth";
import AuthButton from "@/components/AuthButton";
import UserProfile from "@/components/UserProfile";
import WalletAddress from "@/components/WalletAddress";
import WalletBalance from "@/components/WalletBalance";
import SendTransaction from "@/components/SendTransaction";
import TransactionHistory, { TxRecord } from "@/components/TransactionHistory";
import Toast, { ToastMessage } from "@/components/Toast";
import DarkModeToggle from "@/components/DarkModeToggle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LanguageToggle, useI18n } from "@/i18n";

const TX_STORAGE_KEY = "kaiwallet_txs";
const HAS_PRIVY = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function loadTxs(): TxRecord[] {
  try {
    return JSON.parse(localStorage.getItem(TX_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveTxs(txs: TxRecord[]) {
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(txs));
}

// ── Privy 훅은 이 컴포넌트 안에서만 호출 (PrivyProvider 필수) ──
function PrivySection({
  onToast,
  txs,
  onTxSent,
}: {
  onToast: (t: Omit<ToastMessage, "id">) => void;
  txs: TxRecord[];
  onTxSent: (hash: string, to: string, amount: string) => void;
}) {
  const { data: session, status } = useSession();
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    getExternalJwt: useCallback(async () => {
      return session?.privyJwt ?? undefined;
    }, [session?.privyJwt]),
  });

  const walletAddress = wallets.find((w) => w.walletClientType === "privy")?.address;

  if (!authenticated) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 px-1">
        <LoadingSpinner size="sm" />
        <span>지갑 연결 중…</span>
      </div>
    );
  }

  if (!walletAddress) return null;

  return (
    <>
      <WalletAddress address={walletAddress} />
      <WalletBalance address={walletAddress} />
      <SendTransaction onToast={onToast} onTxSent={onTxSent} />
      <TransactionHistory transactions={txs} />
    </>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function Home() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [txs, setTxs] = useState<TxRecord[]>([]);

  useEffect(() => {
    setTxs(loadTxs());
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleTxSent = useCallback((hash: string, to: string, amount: string) => {
    const record: TxRecord = { hash, to, amount, timestamp: Date.now() };
    setTxs((prev) => {
      const next = [record, ...prev].slice(0, 20);
      saveTxs(next);
      return next;
    });
  }, []);

  const isLoggedIn = status === "authenticated";

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const header = (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <span className="font-bold text-lg tracking-tight">{t.appName}</span>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <DarkModeToggle />
        {isLoggedIn && <AuthButton isLoggedIn />}
      </div>
    </header>
  );

  // ── 로그인 상태: 대시보드 ──────────────────────────────────
  if (isLoggedIn && session) {
    return (
      <div className="flex flex-1 flex-col min-h-screen">
        {header}
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-md flex flex-col gap-4">
            <UserProfile session={session} />
            {HAS_PRIVY ? (
              <PrivySection onToast={addToast} txs={txs} onTxSent={handleTxSent} />
            ) : (
              <p className="text-sm text-zinc-400 px-1">
                Privy App ID를 설정하면 지갑이 자동 생성됩니다.
              </p>
            )}
          </div>
        </main>
        <footer className="py-4 text-center text-xs text-zinc-400">
          {t.poweredBy}
        </footer>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // ── 비로그인 상태: 랜딩 ───────────────────────────────────
  return (
    <div className="flex flex-1 flex-col min-h-screen">
      {header}

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-16 gap-12">
        <div className="flex flex-col items-center gap-5 text-center max-w-lg">
          <div className="rounded-2xl bg-[#FEE500] p-4 shadow-sm">
            <svg
              className="w-10 h-10 text-zinc-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 11H4L5 9zm6 5v2"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t.appName}
          </h1>
          <p className="text-xl font-medium text-zinc-600 dark:text-zinc-300">
            {t.tagline}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t.taglineSub}
          </p>
          <AuthButton isLoggedIn={false} />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { title: t.feature1Title, desc: t.feature1Desc, icon: "👤" },
            { title: t.feature2Title, desc: t.feature2Desc, icon: "🔐" },
            { title: t.feature3Title, desc: t.feature3Desc, icon: "⛓️" },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
            >
              <span className="text-2xl">{icon}</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{title}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-4 text-center text-xs text-zinc-400">
        {t.poweredBy}
      </footer>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
