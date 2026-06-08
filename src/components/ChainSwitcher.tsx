"use client";

import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { klaytnBaobab, klaytn, polygonAmoy, polygon } from "viem/chains";

const CHAINS = [
  { id: klaytnBaobab.id, name: "Kaia Kairos (Testnet)", chain: klaytnBaobab },
  { id: klaytn.id, name: "Kaia Mainnet", chain: klaytn },
  { id: polygonAmoy.id, name: "Polygon Amoy (Testnet)", chain: polygonAmoy },
  { id: polygon.id, name: "Polygon Mainnet", chain: polygon },
];

export default function ChainSwitcher() {
  const { wallets } = useWallets();
  const smartWallet = wallets.find((w) => w.walletClientType === "smart-wallet");
  const embeddedWallet = smartWallet || wallets.find((w) => w.walletClientType === "privy");
  const currentChainId = embeddedWallet ? parseInt(embeddedWallet.chainId.replace("eip155:", "")) : undefined;
  const [switching, setSwitching] = useState(false);

  const activeChain = CHAINS.find((c) => c.id === currentChainId);

  async function handleChainChange(chainId: number) {
    if (!embeddedWallet) return;
    setSwitching(true);
    try {
      // Privy wallet.switchChain은 eip155:chainId 형태의 string 또는 number를 받을 수 있습니다.
      // eip155 호환 포맷을 고려하여 숫자형 또는 문자열형으로 전달합니다.
      await embeddedWallet.switchChain(chainId);
    } catch (e) {
      console.error("체인 전환 실패:", e);
    } finally {
      setSwitching(false);
    }
  }

  if (!embeddedWallet) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-2">네트워크 선택</p>
      <div className="relative">
        <select
          value={currentChainId || ""}
          disabled={switching}
          onChange={(e) => handleChainChange(Number(e.target.value))}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-medium"
        >
          {CHAINS.map((c) => (
            <option key={c.id} value={c.id} className="dark:bg-zinc-900">
              {c.name}
            </option>
          ))}
          {!activeChain && currentChainId && (
            <option value={currentChainId} className="dark:bg-zinc-900">
              기타 체인 (ID: {currentChainId})
            </option>
          )}
        </select>
        {switching && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
            전환 중...
          </div>
        )}
      </div>
    </div>
  );
}
