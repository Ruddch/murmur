import React from "react";
import { useAccount } from "wagmi";
import { SignInButton } from "./SignInButton";
import { SessionStep } from "./SessionStep";
import { GameWalletInfo } from "./GameWalletInfo";
import { ClickerGame } from "@/components/game/ClickerGame";
import Leaderboard from "@/components/Leaderboard";
import { useClicker } from "@/hooks/useClicker";

type ConnectionStep = "connect" | "session" | "game";

export function ConnectionFlow() {
  const { isConnected } = useAccount();
  const { isSessionValid, isCreatingSession, createNewSession, agwClient } = useClicker();

  // Determine current step
  const getCurrentStep = (): ConnectionStep => {
    if (!isConnected) return "connect";
    if (!isSessionValid) return "session";
    return "game";
  };

  const currentStep = getCurrentStep();

  const renderStep = () => {
    switch (currentStep) {
      case "connect":
        return (
          <div className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Removed cat gif */}
              {/* Fun header */}
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-roobert)] text-white flex items-center gap-2">
                🐾 Mur Mur 🐾
              </h2>
              {/* English welcome */}
              <p className="text-lg sm:text-xl text-white font-[family-name:var(--font-roobert)] max-w-2xl">
                Meow! Join the Mur Mur — connect your wallet and start the fun!
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SignInButton />
            </div>
            <div className="text-center">
              <p className="text-white font-[family-name:var(--font-roobert)]">
                Connect your Abstract Global Wallet first to enter the mur mur game!
              </p>
            </div>
          </div>
        );

      case "session":
        return <SessionStep isSessionValid={isSessionValid} isCreatingSession={isCreatingSession} createNewSession={createNewSession} agwClient={agwClient} />;

      case "game":
        return (
          <div className="w-full">
            <div className="text-center space-y-4 mb-8 w-full max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-roobert)] text-white">
                Ready to Click!
              </h2>
              <p className="text-lg sm:text-xl text-white font-[family-name:var(--font-roobert)] text-center">
                Your session is active. Start clicking and compete for the top spot!
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col">
                <ClickerGame />
                <div className="mt-8">
                  <GameWalletInfo />
                </div>
              </div>
              <div className="flex flex-col">
                <Leaderboard />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center z-10 text-white text-center">
      <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex items-center gap-2 ${isConnected ? "text-green-400" : currentStep === "connect" ? "text-blue-400" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isConnected ? "bg-green-500" : currentStep === "connect" ? "bg-blue-500" : "bg-gray-600"}`}>
              1
            </div>
            <span className="hidden sm:inline">Connect Wallet</span>
          </div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`flex items-center gap-2 ${currentStep === "session" ? "text-blue-400" : currentStep === "game" ? "text-green-400" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === "session" ? "bg-blue-500" : currentStep === "game" ? "bg-green-500" : "bg-gray-600"
            }`}>
              2
            </div>
            <span className="hidden sm:inline">Create Session</span>
          </div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`flex items-center gap-2 ${currentStep === "game" ? "text-green-400" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === "game" ? "bg-green-500" : "bg-gray-600"
            }`}>
              3
            </div>
            <span className="hidden sm:inline">Play Game</span>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
} 