import React, { useEffect, useState } from "react";
import { SessionManager } from "./SessionManager";

interface SessionStepProps {
  isSessionValid: boolean;
  isCreatingSession: boolean;
  createNewSession: () => Promise<unknown>;
  agwClient: unknown;
}

export function SessionStep({ isSessionValid, isCreatingSession, createNewSession, agwClient }: SessionStepProps) {
  const [autoCreateError, setAutoCreateError] = useState(false);
  const [autoTried, setAutoTried] = useState(false);

  useEffect(() => {
    if (!isSessionValid && !isCreatingSession && !autoTried && agwClient) {
      setAutoTried(true);
      setTimeout(async () => {
        try {
          await createNewSession();
        } catch {
          setAutoCreateError(true);
        }
      }, 1000);
    }
  }, [isSessionValid, isCreatingSession, createNewSession, autoTried, agwClient]);

  useEffect(() => {
    if (isSessionValid) {
      setAutoCreateError(false);
      setAutoTried(false);
    }
  }, [isSessionValid]);

  const handleCreateSession = async () => {
    try {
      setAutoCreateError(false);
      await createNewSession();
    } catch (error) {
      console.error('SessionStep: Failed to create session:', error);
      setAutoCreateError(true);
    }
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center space-y-4 w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-roobert)] text-white">
          {autoCreateError ? 'Create Session Key' : 'Create Session Key'}
        </h2>
        <p className="text-lg sm:text-xl text-white font-[family-name:var(--font-roobert)] max-w-2xl mx-auto">
          {autoCreateError 
            ? 'Failed to create session. Please try again.'
            : 'Create a session key to enable seamless clicking without signing each transaction.'
          }
        </p>
      </div>
      
      {/* Create session button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleCreateSession}
          disabled={isCreatingSession}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isCreatingSession
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isCreatingSession ? 'Creating Session...' : 'Create Session Key'}
        </button>
        
        {isCreatingSession && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-[family-name:var(--font-roobert)]">
                Creating session...
              </span>
            </div>
          </div>
        )}
      </div>
      
      {autoCreateError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md w-full flex flex-col items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-[family-name:var(--font-roobert)]">
                Session creation failed.
              </span>
            </div>
            <button
              onClick={handleCreateSession}
              disabled={isCreatingSession}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isCreatingSession
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isCreatingSession ? 'Creating...' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full flex flex-col items-center">
        <SessionManager />
      </div>
      
      <div className="text-center w-full max-w-lg">
        <p className="text-white font-[family-name:var(--font-roobert)]">
          Create a session to start clicking and competing!
        </p>
      </div>
    </div>
  );
} 