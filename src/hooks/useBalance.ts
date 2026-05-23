"use client";

import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { klaytnBaobab } from "viem/chains";

const client = createPublicClient({
  chain: klaytnBaobab,
  transport: http(),
});

export function useBalance(address?: string) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    client
      .getBalance({ address: address as `0x${string}` })
      .then((raw) => {
        if (!cancelled) setBalance(parseFloat(formatEther(raw)).toFixed(4));
      })
      .catch(() => {
        if (!cancelled) setError("잔액 조회 실패");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  return { balance, loading, error };
}
