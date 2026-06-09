"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, parseEther, isAddress, encodeFunctionData, parseUnits, createPublicClient, http } from "viem";
import { klaytnBaobab, klaytn, polygonAmoy, polygon } from "viem/chains";
import LoadingSpinner from "./LoadingSpinner";
import type { ToastMessage } from "./Toast";

const CHAINS = [klaytnBaobab, klaytn, polygonAmoy, polygon];

interface Props {
  onToast: (toast: Omit<ToastMessage, "id">) => void;
  onTxSent: (hash: string, to: string, amount: string) => void;
}

export default function SendTransaction({ onToast, onTxSent }: Props) {
  const { wallets } = useWallets();
  const [assetType, setAssetType] = useState<"native" | "erc20">("native");
  const [tokenAddress, setTokenAddress] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  const smartWallet = wallets.find((w) => w.walletClientType === "smart-wallet");
  const embeddedWallet = smartWallet || wallets.find((w) => w.walletClientType === "privy");

  const currentChainId = embeddedWallet ? parseInt(embeddedWallet.chainId.replace("eip155:", "")) : undefined;
  const symbol = currentChainId === 137 || currentChainId === 80002 ? "POL" : "KAIA";

  async function handleSend() {
    if (!embeddedWallet) {
      onToast({ type: "error", message: "지갑이 연결되지 않았습니다." });
      return;
    }
    if (assetType === "erc20" && !isAddress(tokenAddress)) {
      onToast({ type: "error", message: "유효한 토큰 컨트랙트 주소를 입력하세요." });
      return;
    }
    if (!isAddress(to)) {
      onToast({ type: "error", message: "유효한 수신 주소를 입력하세요." });
      return;
    }
    if (to.toLowerCase() === embeddedWallet.address.toLowerCase()) {
      onToast({ type: "error", message: "본인 주소로 송금할 수 없습니다." });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      onToast({ type: "error", message: "보낼 금액을 입력하세요." });
      return;
    }

    setSending(true);
    try {
      const provider = await embeddedWallet.getEthereumProvider();
      const targetChain = CHAINS.find((c) => c.id === currentChainId) || klaytnBaobab;

      const walletClient = createWalletClient({
        chain: targetChain,
        transport: custom(provider),
      });

      let hash: `0x${string}`;

      if (assetType === "native") {
        hash = await walletClient.sendTransaction({
          to: to as `0x${string}`,
          value: parseEther(amount),
          account: embeddedWallet.address as `0x${string}`,
        });
      } else {
        const publicClient = createPublicClient({
          chain: targetChain,
          transport: http(),
        });

        // 1. Get decimals and symbol dynamically
        const [decimals, sym] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: [{ name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] }],
            functionName: "decimals",
          }),
          publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: [{ name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }],
            functionName: "symbol",
          }),
        ]);

        // 2. Encode ERC-20 transfer call data
        const data = encodeFunctionData({
          abi: [
            {
              name: "transfer",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [
                { name: "recipient", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
            },
          ],
          functionName: "transfer",
          args: [to as `0x${string}`, parseUnits(amount, decimals)],
        });

        // 3. Send transaction to token contract
        hash = await walletClient.sendTransaction({
          to: tokenAddress as `0x${string}`,
          data,
          account: embeddedWallet.address as `0x${string}`,
        });
      }

      onTxSent(hash, to, amount);
      onToast({ type: "success", message: `전송 완료! TX: ${hash.slice(0, 10)}…` });
      setTo("");
      setAmount("");
      if (assetType === "erc20") setTokenAddress("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "알 수 없는 오류";
      onToast({ type: "error", message: `전송 실패: ${msg.slice(0, 60)}` });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 shadow-sm">
      <p className="text-xs text-zinc-400 mb-3">자산 보내기</p>
      <div className="flex flex-col gap-2">
        {/* 자산 타입 선택 */}
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as "native" | "erc20")}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-medium"
        >
          <option value="native" className="dark:bg-zinc-900">기본 코인 ({symbol})</option>
          <option value="erc20" className="dark:bg-zinc-900">사용자 정의 토큰 (ERC-20)</option>
        </select>

        {/* ERC-20 일 때 토큰 주소 입력 */}
        {assetType === "erc20" && (
          <input
            type="text"
            placeholder="토큰 컨트랙트 주소 (0x…)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-mono placeholder:text-zinc-400"
          />
        )}

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
            placeholder={assetType === "native" ? `금액 (${symbol})` : "금액"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.001"
            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder:text-zinc-400"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50"
          >
            {sending && <LoadingSpinner size="sm" />}
            {sending ? "전송 중…" : "보내기"}
          </button>
        </div>
      </div>
    </div>
  );
}
