"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, parseEther, isAddress } from "viem";
import { klaytnBaobab } from "viem/chains";
import LoadingSpinner from "./LoadingSpinner";
import type { ToastMessage } from "./Toast";

interface Props {
  onToast: (toast: Omit<ToastMessage, "id">) => void;
  onTxSent: (hash: string, to: string, amount: string) => void;
}

export default function SendTransaction({ onToast, onTxSent }: Props) {
  const { wallets } = useWallets();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  const embeddedWallet = wallets.find(
    (w) => w.walletClientType === "privy"
  );

  async function handleSend() {
    if (!embeddedWallet) {
      onToast({ type: "error", message: "지갑이 연결되지 않았습니다." });
      return;
    }
    if (!isAddress(to)) {
      onToast({ type: "error", message: "유효한 이더리움 주소를 입력하세요." });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      onToast({ type: "error", message: "보낼 금액을 입력하세요." });
      return;
    }

    setSending(true);
    try {
      const provider = await embeddedWallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: klaytnBaobab,
        transport: custom(provider),
      });
      const hash = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        value: parseEther(amount),
        account: embeddedWallet.address as `0x${string}`,
      });
      onTxSent(hash, to, amount);
      onToast({ type: "success", message: `전송 완료! TX: ${hash.slice(0, 10)}…` });
      setTo("");
      setAmount("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류";
      onToast({ type: "error", message: `전송 실패: ${msg.slice(0, 60)}` });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-3">KAIA 보내기</p>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="수신 주소 (0x…)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-mono placeholder:text-zinc-400"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="금액 (KAIA)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.001"
            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder:text-zinc-400"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50"
          >
            {sending && <LoadingSpinner size="sm" />}
            {sending ? "전송 중…" : "보내기"}
          </button>
        </div>
      </div>
    </div>
  );
}
