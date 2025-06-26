"use client";

import { useSessionKey } from '@/hooks/useSessionKey';

export function SessionKeyManager() {
  const {
    sessionConfig,
    sessionHash,
    isSessionValid,
    isSessionExpired,
    isCreatingSession,
    isRevokingSession,
    createNewSession,
    revokeCurrentSession,
    globalWalletAddress,
    storedSession,
  } = useSessionKey();

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
      if (globalWalletAddress) localStorage.removeItem(`session_${globalWalletAddress}`);
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  if (!globalWalletAddress) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">🔑 Session Keys</h3>
          <p className="text-gray-400">Connect your Abstract Global Wallet to manage session keys</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          🔑 Session Keys
        </h3>
        <p className="text-gray-300 text-sm">Enable seamless transactions without signing each time</p>
      </div>

      <div className="space-y-4">
        {/* Session Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isSessionValid ? 'bg-green-500' : 
              isSessionExpired ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-300">
              {isSessionValid ? 'Active Session' : 
               isSessionExpired ? 'Expired Session' : 'No Active Session'}
            </span>
          </div>
          {storedSession && (
            <span className="text-xs text-gray-400">
              Expires: {new Date(storedSession.expiresAt).toLocaleString()}
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
              disabled={isRevokingSession}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                isRevokingSession
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isRevokingSession ? 'Revoking...' : 'Revoke Session'}
            </button>
          )}
        </div>

        {/* Session Info */}
        {sessionConfig && (
          <div className="text-xs text-gray-400 space-y-1 bg-white/5 p-3 rounded-lg">
            <div className="flex justify-between">
              <span>Session Hash:</span>
              <span className="font-mono">{sessionHash?.slice(0, 8)}...{sessionHash?.slice(-6)}</span>
            </div>
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
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={isSessionValid ? 'text-green-400' : 'text-red-400'}>
                {isSessionValid ? 'Valid' : 'Expired'}
              </span>
            </div>
            {storedSession && (
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-mono">{new Date(storedSession.createdAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Benefits Info */}
        <div className="text-xs text-gray-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
          <h4 className="font-semibold text-blue-400 mb-2">Session Key Benefits:</h4>
          <ul className="space-y-1">
            <li>• No need to sign each transaction</li>
            <li>• Faster user experience</li>
            <li>• Perfect for games and frequent interactions</li>
            <li>• Automatically expires for security</li>
            <li>• Limited to specific contract functions</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 