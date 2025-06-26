import React from "react";

interface WalletInfoProps {
  balance: {
    formatted: string;
    symbol: string;
  } | undefined;
}

export function WalletInfo({ balance }: WalletInfoProps) {
  return (
    <div className="w-full bg-black/20 rounded-lg p-4 border border-white/10">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 font-[family-name:var(--font-roobert)]">
            Balance
          </span>
          <span className="text-sm font-mono text-white">
            {balance ? (
              <>
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </>
            ) : (
              "Loading..."
            )}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 font-[family-name:var(--font-roobert)]">
            Network
          </span>
          <span className="text-sm text-green-400 font-[family-name:var(--font-roobert)]">
            Abstract Testnet
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300 font-[family-name:var(--font-roobert)]">
            Wallet Type
          </span>
          <span className="text-sm text-blue-400 font-[family-name:var(--font-roobert)]">
            Smart Contract
          </span>
        </div>
      </div>
    </div>
  );
} 