import React from "react";
import { useAccount, useBalance } from "wagmi";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { SendTransaction } from "./SendTransaction";
import { WalletInfo } from "./WalletInfo";
import { useClicker } from "@/hooks/useClicker";

export function ConnectedState() {
  const { address } = useAccount();
  const { logout } = useLoginWithAbstract();
  const { data: balance } = useBalance({
    address,
  });

  const {
    sessionConfig,
    isSessionValid,
    isCreatingSession,
    isExecutingSession,
    isSessionLoading,
    isSessionSuccess,
    createNewSession,
    revokeCurrentSession,
  } = useClicker();

  const handleCreateSession = async () => {
    try {
      await createNewSession();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
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
    <div className="space-y-6">
      {/* Wallet Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg backdrop-blur-sm w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          {/* Wallet Status */}
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)]">
                Connected to Abstract Global Wallet
              </p>
            </div>
            <p className="text-xs text-gray-400 font-mono break-all bg-black/20 px-2 py-1 rounded">
              {address}
            </p>
          </div>

          {/* Wallet Info */}
          <WalletInfo balance={balance} />

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col gap-3 w-full">
              <SendTransaction />
              <button
                className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-white/10 text-white gap-2 hover:bg-white/20 hover:cursor-pointer text-sm px-5 font-[family-name:var(--font-roobert)] w-full h-10 py-2"
                onClick={logout}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                Disconnect Wallet
              </button>
            </div>
          </div>

          {/* Abstract Info */}
          <div className="text-center text-xs text-gray-400 mt-4">
            <p>Powered by Abstract Global Wallet</p>
            <p>Native Account Abstraction</p>
          </div>
        </div>
      </div>

      {/* Session Key Card */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg backdrop-blur-sm w-full max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🔑 Session Keys
          </h3>
          <p className="text-gray-300 text-sm">Enable seamless clicking without signing each transaction</p>
        </div>

        <div className="space-y-4">
          {/* Session Status */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSessionValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300">
                {isSessionValid ? 'Active Session' : 'No Active Session'}
              </span>
            </div>
            {sessionConfig && (
              <span className="text-xs text-gray-400">
                Expires: {new Date(Number(sessionConfig.expiresAt) * 1000).toLocaleString()}
              </span>
            )}
          </div>

          {/* Session Actions */}
          <div className="flex gap-2">
            {!isSessionValid ? (
              <button
                onClick={handleCreateSession}
                disabled={isCreatingSession}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isCreatingSession
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isCreatingSession ? 'Creating...' : 'Create Session'}
              </button>
            ) : (
              <button
                onClick={handleRevokeSession}
                className="flex-1 py-2 px-4 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
              >
                Revoke Session
              </button>
            )}
          </div>

          {/* Session Info */}
          {sessionConfig && (
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Signer:</span>
                <span className="font-mono">{sessionConfig.signer.slice(0, 6)}...{sessionConfig.signer.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Limit:</span>
                <span className="font-mono">{sessionConfig.feeLimit.limit.toString()} wei</span>
              </div>
              <div className="flex justify-between">
                <span>Allowed Functions:</span>
                <span className="text-green-400">click(), reset()</span>
              </div>
            </div>
          )}

          {/* Session Transaction Status */}
          {(isExecutingSession || isSessionLoading) && (
            <div className="text-center py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-400">
                  {isExecutingSession ? 'Executing transaction...' : 'Waiting for confirmation...'}
                </span>
              </div>
            </div>
          )}

          {isSessionSuccess && (
            <div className="text-center py-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-sm text-green-400">✅ Transaction successful!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
