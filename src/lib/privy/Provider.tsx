"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { klaytnBaobab } from "viem/chains";

// Kaia Kairos = 구 Klaytn Baobab (체인 ID 1001)
const kaiaKairos = {
  ...klaytnBaobab,
  name: "Kaia Kairos Testnet",
} as const;

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) return <>{children}</>;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "google"],
        appearance: {
          theme: "light",
          accentColor: "#FEE500",
          logo: "/logo.png",
        },
        supportedChains: [kaiaKairos],
        defaultChain: kaiaKairos,
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
