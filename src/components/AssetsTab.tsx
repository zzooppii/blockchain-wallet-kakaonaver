"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useERC20Balance } from "@/hooks/useERC20Balance";
import LoadingSpinner from "./LoadingSpinner";

const PRESET_TOKENS: Record<number, { address: string; name: string; symbol: string }[]> = {
  1001: [
    { address: "0x5c74070f23bf715b853b80b27b0ebc5c7ce40b2a", name: "Kairos Wrapped KAIA", symbol: "WKAIA" }
  ],
  80002: [
    { address: "0x0fd81c50297cc25d172c3d82a17498c8c222ff11", name: "Amoy Test Token", symbol: "ATT" }
  ]
};

function TokenRow({ tokenAddress, userAddress, chainId }: { tokenAddress: string; userAddress?: string; chainId?: number }) {
  const { balance, symbol, loading, error } = useERC20Balance(tokenAddress, userAddress, chainId);

  if (loading) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
        <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !balance) return null;

  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 text-sm">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{symbol}</span>
        <span className="text-xs text-zinc-400 font-mono select-all">
          {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
        </span>
      </div>
      <span className="font-medium text-zinc-800 dark:text-zinc-200">
        {balance} <span className="text-zinc-400 text-xs">{symbol}</span>
      </span>
    </div>
  );
}

export default function AssetsTab() {
  const { wallets } = useWallets();
  const smartWallet = wallets.find((w) => w.walletClientType === "smart-wallet");
  const embeddedWallet = smartWallet || wallets.find((w) => w.walletClientType === "privy");
  const chainId = embeddedWallet ? parseInt(embeddedWallet.chainId.replace("eip155:", "")) : undefined;
  const userAddress = embeddedWallet?.address;

  const [activeTab, setActiveTab] = useState<"token" | "nft">("token");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [customTokens, setCustomTokens] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const presetList = (chainId && PRESET_TOKENS[chainId]) || [];
  const allTokenAddresses = [...presetList.map((t) => t.address), ...customTokens];

  function handleAddToken() {
    setErrorMsg("");
    const addr = customTokenAddress.trim().toLowerCase();
    if (!addr.startsWith("0x") || addr.length !== 42) {
      setErrorMsg("유효한 토큰 컨트랙트 주소가 아닙니다.");
      return;
    }
    if (allTokenAddresses.map((t) => t.toLowerCase()).includes(addr)) {
      setErrorMsg("이미 추가된 토큰 주소입니다.");
      return;
    }
    setCustomTokens((prev) => [...prev, addr]);
    setCustomTokenAddress("");
  }

  if (!embeddedWallet) return null;

  // Mock NFT (User Address 기반 고유 NFT)
  const nftId = userAddress ? userAddress.slice(-4) : "0000";
  const avatarUrl = userAddress
    ? `https://robohash.org/${userAddress}.png?set=set4&bgset=bg1`
    : "";

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      {/* 탭 헤더 */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("token")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === "token"
              ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          토큰
        </button>
        <button
          onClick={() => setActiveTab("nft")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            activeTab === "nft"
              ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          NFT
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="p-5">
        {activeTab === "token" ? (
          <div className="flex flex-col gap-4">
            {/* 토큰 리스트 */}
            <div className="flex flex-col">
              <p className="text-xs text-zinc-400 mb-2 font-medium">보유 중인 ERC-20 토큰</p>
              {allTokenAddresses.length === 0 ? (
                <p className="text-xs text-zinc-400 py-4 text-center">보유 중인 토큰이 없거나 조회되지 않았습니다.</p>
              ) : (
                <div className="flex flex-col">
                  {allTokenAddresses.map((addr) => (
                    <TokenRow
                      key={addr}
                      tokenAddress={addr}
                      userAddress={userAddress}
                      chainId={chainId}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 토큰 추가 인풋 */}
            <div className="mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <p className="text-xs text-zinc-400 mb-2 font-medium">토큰 주소 추가 (ERC-20)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="컨트랙트 주소 (0x…)"
                  value={customTokenAddress}
                  onChange={(e) => setCustomTokenAddress(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-mono placeholder:text-zinc-400"
                />
                <button
                  onClick={handleAddToken}
                  className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
                >
                  추가
                </button>
              </div>
              {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400 mb-1 font-medium">보유 중인 NFT 컬렉션</p>
            <div className="grid grid-cols-2 gap-3">
              {/* 내 아바타 고유 NFT */}
              {userAddress && (
                <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden shadow-xs">
                  <div className="relative aspect-square w-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center">
                    <img
                      src={avatarUrl}
                      alt="Cyber Cat NFT"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xxs text-zinc-400 font-semibold uppercase tracking-wider">KaiWallet Cyber Cat</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5"># {nftId}</p>
                  </div>
                </div>
              )}

              {/* 기본 안내 카드 */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-4 text-center aspect-square">
                <span className="text-2xl mb-1">🎨</span>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">민팅 준비 중</p>
                <p className="text-xxs text-zinc-400 mt-1">곧 다른 컬렉션도 추가됩니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
