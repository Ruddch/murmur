import React from "react";
import { useAccount, useBalance } from "wagmi";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { WalletInfo } from "./WalletInfo";
import { useClicker } from "@/hooks/useClicker";

export function GameWalletInfo() {
  const { address } = useAccount();
  const { logout } = useLoginWithAbstract();
  const { data: balance } = useBalance({
    address,
  });

  const {
    sessionConfig,
    isSessionValid,
    revokeCurrentSession,
  } = useClicker();

  const handleLogout = async () => {
    // First revoke session if it's active
    if (isSessionValid) {
      try {
        await revokeCurrentSession();
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }
    }
    // Then disconnect wallet
    logout();
  };

  const handleRevokeSession = async () => {
    try {
      await revokeCurrentSession();
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  if (!address) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 shadow-lg backdrop-blur-sm w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        {/* Wallet Status */}
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium font-[family-name:var(--font-roobert)]">
              Connected
            </p>
          </div>
          <p className="text-xs text-gray-400 font-mono break-all bg-black/20 px-2 py-1 rounded">
            {address}
          </p>
        </div>

        {/* Session Status */}
        <div className="flex items-center justify-center gap-2 w-full">
          <div className={`w-2 h-2 rounded-full ${isSessionValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-300">
            {isSessionValid ? 'Session Active' : 'No Session'}
          </span>
          {sessionConfig && (
            <span className="text-xs text-gray-400 ml-auto">
              Expires: {new Date(Number(sessionConfig.expiresAt) * 1000).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Wallet Info */}
        <WalletInfo balance={balance} />

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full">
          {isSessionValid && (
            <button
              onClick={handleRevokeSession}
              className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-red-500/20 text-red-400 gap-2 hover:bg-red-500/30 hover:cursor-pointer text-xs px-3 font-[family-name:var(--font-roobert)] w-full h-8 py-1"
            >
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Revoke Session
            </button>
          )}
          
          <button
            className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-white/10 text-white gap-2 hover:bg-white/20 hover:cursor-pointer text-xs px-3 font-[family-name:var(--font-roobert)] w-full h-8 py-1"
            onClick={handleLogout}
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
} 