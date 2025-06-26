import { useState, useEffect } from 'react';
import { useGlobalWalletSignerAccount, useAbstractClient } from '@abstract-foundation/agw-react';
import { useCreateSession, useRevokeSessions } from '@abstract-foundation/agw-react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { CLICKER_ADDRESS, CLICKER_ABI } from '@/contracts/Clicker';
import { 
  type SessionConfig, 
  LimitType, 
  getSessionHash,
  type Constraint,
  type TransferPolicy
} from '@abstract-foundation/agw-client/sessions';
import { toFunctionSelector } from 'viem';
import { generatePrivateKey, privateKeyToAccount, type Account } from 'viem/accounts';
import type { SessionClient } from '@abstract-foundation/agw-client/sessions';

export interface StoredSessionConfig {
  sessionConfig: {
    signer: string;
    expiresAt: string;
    feeLimit: {
      limitType: number;
      limit: string;
      period: string;
    };
    callPolicies: Array<{
      target: string;
      selector: string;
      valueLimit: {
        limitType: number;
        limit: string;
        period: string;
      };
      maxValuePerUse: string;
      constraints: Constraint[];
    }>;
    transferPolicies: TransferPolicy[];
  };
  sessionHash: string;
  expiresAt: number;
  createdAt: number;
  sessionSignerPrivateKey: string;
}

// Helper function to convert SessionConfig to serializable format
const serializeSessionConfig = (config: SessionConfig) => ({
  signer: config.signer,
  expiresAt: config.expiresAt.toString(),
  feeLimit: {
    limitType: config.feeLimit.limitType,
    limit: config.feeLimit.limit.toString(),
    period: config.feeLimit.period.toString(),
  },
  callPolicies: config.callPolicies.map(policy => ({
    target: policy.target,
    selector: policy.selector,
    valueLimit: {
      limitType: policy.valueLimit.limitType,
      limit: policy.valueLimit.limit.toString(),
      period: policy.valueLimit.period.toString(),
    },
    maxValuePerUse: policy.maxValuePerUse.toString(),
    constraints: policy.constraints,
  })),
  transferPolicies: config.transferPolicies,
});

// Helper function to convert serialized config back to SessionConfig
const deserializeSessionConfig = (config: StoredSessionConfig['sessionConfig']): SessionConfig => ({
  signer: config.signer as `0x${string}`,
  expiresAt: BigInt(config.expiresAt),
  feeLimit: {
    limitType: config.feeLimit.limitType,
    limit: BigInt(config.feeLimit.limit),
    period: BigInt(config.feeLimit.period),
  },
  callPolicies: config.callPolicies.map(policy => ({
    target: policy.target as `0x${string}`,
    selector: policy.selector as `0x${string}`,
    valueLimit: {
      limitType: policy.valueLimit.limitType,
      limit: BigInt(policy.valueLimit.limit),
      period: BigInt(policy.valueLimit.period),
    },
    maxValuePerUse: BigInt(policy.maxValuePerUse),
    constraints: policy.constraints,
  })),
  transferPolicies: config.transferPolicies,
});

export function useSessionKey() {
  const { address: globalWalletAddress } = useGlobalWalletSignerAccount();
  const { data: agwClient, isLoading: isAgwClientLoading } = useAbstractClient();
  
  const [storedSession, setStoredSession] = useState<StoredSessionConfig | null>(null);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionSigner, setSessionSigner] = useState<Account | null>(null);
  const [sessionClient, setSessionClient] = useState<SessionClient | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isRevokingSession, setIsRevokingSession] = useState(false);
  const [isExecutingSession, setIsExecutingSession] = useState(false);
  const [lastSessionTxHash, setLastSessionTxHash] = useState<string | null>(null);

  // Abstract Global Wallet session hooks
  const { createSessionAsync, isPending: isCreatingSessionPending } = useCreateSession();
  const { revokeSessionsAsync, isPending: isRevokingSessionPending } = useRevokeSessions();

  // Wait for session transaction
  const { isLoading: isSessionLoading, isSuccess: isSessionSuccess } = useWaitForTransactionReceipt({
    hash: lastSessionTxHash as `0x${string}` | undefined,
  });

  // Clear session on logout
  useEffect(() => {
    if (!globalWalletAddress && (storedSession || sessionConfig || sessionSigner || sessionClient)) {
      // If there's an active session — revoke it
      if (sessionConfig) {
        (async () => {
          try {
            await revokeSessionsAsync({ sessions: sessionConfig });
          } catch {
            // ignore
          }
        })();
      }
      // Clear all states and localStorage
      setStoredSession(null);
      setSessionConfig(null);
      setSessionSigner(null);
      setSessionClient(null);
      localStorage.clear(); // If you need to clear only the session, use localStorage.removeItem(...)
    }
  }, [globalWalletAddress]);

  // Load session from localStorage on mount
  useEffect(() => {
    if (globalWalletAddress) {
      const savedSession = localStorage.getItem(`session_${globalWalletAddress}`);
      if (savedSession) {
        try {
          const parsed: StoredSessionConfig = JSON.parse(savedSession);
          // Check if session is still valid
          if (parsed.expiresAt > Date.now()) {
            setStoredSession(parsed);
            const config = deserializeSessionConfig(parsed.sessionConfig);
            setSessionConfig(config);
            
            // Recreate session signer
            const signer = privateKeyToAccount(parsed.sessionSignerPrivateKey as `0x${string}`);
            setSessionSigner(signer);
          } else {
            // Session expired, remove from storage
            localStorage.removeItem(`session_${globalWalletAddress}`);
          }
        } catch (error) {
          localStorage.removeItem(`session_${globalWalletAddress}`);
        }
      }
    }
  }, [globalWalletAddress]);

  // Create session client when we have all required data
  useEffect(() => {
    if (agwClient && sessionSigner && sessionConfig) {
      try {
        const client = agwClient.toSessionClient(sessionSigner, sessionConfig);
        setSessionClient(client);
      } catch (error) {
        // ignore
      }
    }
  }, [agwClient, sessionSigner, sessionConfig]);

  const createNewSession = async () => {
    if (isAgwClientLoading) {
      throw new Error('agwClient is still loading');
    }
    
    if (!globalWalletAddress || !agwClient) {
      throw new Error('Missing required data for session creation');
    }

    setIsCreatingSession(true);
    try {
      // Generate a new session signer
      const sessionPrivateKey = generatePrivateKey();
      const sessionSignerAccount = privateKeyToAccount(sessionPrivateKey);

      // Generate a session configuration for the Clicker contract
      const sessionConfig: SessionConfig = {
        signer: sessionSignerAccount.address,
        expiresAt: BigInt(Math.floor(Date.now() / 1000) + 24 * 60 * 60), // 24 hours from now
        feeLimit: {
          limitType: LimitType.Lifetime,
          limit: BigInt(1000000000000000000), // 1 ETH lifetime gas limit
          period: BigInt(0),
        },
        callPolicies: [
          {
            target: CLICKER_ADDRESS,
            selector: toFunctionSelector("click()"),
            valueLimit: {
              limitType: LimitType.Unlimited,
              limit: BigInt(0),
              period: BigInt(0),
            },
            maxValuePerUse: BigInt(0),
            constraints: [],
          },
          {
            target: CLICKER_ADDRESS,
            selector: toFunctionSelector("reset()"),
            valueLimit: {
              limitType: LimitType.Unlimited,
              limit: BigInt(0),
              period: BigInt(0),
            },
            maxValuePerUse: BigInt(0),
            constraints: [],
          }
        ],
        transferPolicies: [],
      };

      // Create the session using Abstract Global Wallet
      await createSessionAsync({
        session: sessionConfig,
      });

      // Get session hash
      const sessionHash = getSessionHash(sessionConfig);

      // Store session configuration (serialized)
      const storedConfig: StoredSessionConfig = {
        sessionConfig: serializeSessionConfig(sessionConfig),
        sessionHash,
        expiresAt: Number(sessionConfig.expiresAt) * 1000, // Convert to milliseconds
        createdAt: Date.now(),
        sessionSignerPrivateKey: sessionPrivateKey,
      };

      // Save to localStorage
      localStorage.setItem(`session_${globalWalletAddress}`, JSON.stringify(storedConfig));
      
      setStoredSession(storedConfig);
      setSessionConfig(sessionConfig);
      setSessionSigner(sessionSignerAccount);
      
      return storedConfig;
    } catch (error) {
      throw error;
    } finally {
      setIsCreatingSession(false);
    }
  };

  const revokeCurrentSession = async () => {
    if (!sessionConfig) return;

    setIsRevokingSession(true);
    try {
      // Revoke the session using Abstract Global Wallet
      await revokeSessionsAsync({
        sessions: sessionConfig,
      });

      // Remove from localStorage
      if (globalWalletAddress) {
        localStorage.removeItem(`session_${globalWalletAddress}`);
      }
      
      setStoredSession(null);
      setSessionConfig(null);
      setSessionSigner(null);
      setSessionClient(null);
    } catch (error) {
      throw error;
    } finally {
      setIsRevokingSession(false);
    }
  };

  const executeWithSession = async (functionName: 'click' | 'reset') => {
    if (!sessionClient || !isSessionValid) {
      throw new Error('No valid session client available');
    }

    setIsExecutingSession(true);
    try {
      // Use the session client to execute the transaction
      const hash = await sessionClient.writeContract({
        address: CLICKER_ADDRESS,
        abi: CLICKER_ABI,
        functionName,
        chain: sessionClient.chain,
        account: sessionClient.account,
      });

      // Set the transaction hash for tracking
      setLastSessionTxHash(hash);
      
      return hash;
    } catch (error) {
      throw error;
    } finally {
      setIsExecutingSession(false);
    }
  };

  // Simplified session validity check
  const isSessionValid = Boolean(
    storedSession &&
    sessionConfig &&
    sessionSigner &&
    sessionClient
  );
  
  const isSessionExpired = storedSession && storedSession.expiresAt <= Date.now();

  return {
    sessionConfig,
    sessionHash: storedSession?.sessionHash || null,
    sessionClient,
    isSessionValid,
    isSessionExpired,
    isCreatingSession: isCreatingSession || isCreatingSessionPending,
    isRevokingSession: isRevokingSession || isRevokingSessionPending,
    isExecutingSession,
    isSessionLoading,
    isSessionSuccess,
    lastSessionTxHash,
    createNewSession,
    revokeCurrentSession,
    executeWithSession,
    globalWalletAddress,
    storedSession,
  };
} 