"use client";

import { useClicker } from '@/hooks/useClicker';
import { AnimatedCat } from './AnimatedCat';

export function ClickerGame() {
  const {
    totalClicks,
    userClicks,
    isOwner,
    click,
    reset,
    isClicking,
    isResetting,
    isConnected,
    address,
    sessionConfig,
    isSessionValid,
  } = useClicker();

  const handleClick = () => {
    if (isConnected && click) {
      click();
    }
  };

  const handleReset = () => {
    if (isOwner && reset) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Clicker Card */}
      <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">🐱 Mur Mur</h2>
          <p className="text-gray-300">Click the cat to earn points and climb the leaderboard!</p>
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Connect your wallet to start clicking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Animated Cat Button */}
            <AnimatedCat
              onClick={handleClick}
              disabled={isClicking}
              isSessionValid={isSessionValid || false}
              isClicking={isClicking}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-300">Your Clicks</p>
                <p className="text-2xl font-bold text-green-400">{userClicks.toString()}</p>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-300">Total Clicks</p>
                <p className="text-2xl font-bold text-blue-400">{totalClicks.toString()}</p>
              </div>
            </div>

            {/* Reset Button (Owner Only) */}
            {isOwner && (
              <button
                onClick={handleReset}
                disabled={isResetting}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isResetting
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                🔄 {isResetting ? 'Resetting...' : 'Reset All Scores'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contract Info */}
      <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📋 Contract Info
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Contract:</span>
            <span className="font-mono text-gray-300">0x83d3e7...dc80</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Network:</span>
            <span className="text-gray-300">Abstract Testnet</span>
          </div>
          {address && (
            <div className="flex justify-between">
              <span className="text-gray-300">Your Address:</span>
              <span className="font-mono text-gray-300">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
          )}
          {sessionConfig && (
            <div className="flex justify-between">
              <span className="text-gray-300">Session Expires:</span>
              <span className="text-gray-300">
                {new Date(Number(sessionConfig.expiresAt) * 1000).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 