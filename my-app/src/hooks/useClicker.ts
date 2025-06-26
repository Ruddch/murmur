import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CLICKER_ADDRESS, CLICKER_ABI } from '@/contracts/Clicker';
import { useEffect } from 'react';
import { useSessionKey } from './useSessionKey';
import { useAbstractClient } from '@abstract-foundation/agw-react';

export function useClicker() {
  const { address, isConnected } = useAccount();
  
  // Session key hook
  const {
    sessionConfig,
    isSessionValid,
    isCreatingSession,
    isExecutingSession,
    isSessionLoading,
    isSessionSuccess,
    createNewSession,
    revokeCurrentSession,
    executeWithSession,
    sessionClient,
  } = useSessionKey();
  const { data: agwClient } = useAbstractClient();

  // Read total clicks
  const { data: totalClicks, refetch: refetchTotalClicks } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'totalClicks',
  });

  // Read user clicks
  const { data: userClicks, refetch: refetchUserClicks } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'userClicks',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  // Read owner
  const { data: owner } = useReadContract({
    address: CLICKER_ADDRESS,
    abi: CLICKER_ABI,
    functionName: 'owner',
  });

  // Click function
  const { data: clickHash, writeContract: click, isPending: isClicking } = useWriteContract();

  // Reset function (owner only)
  const { data: resetHash, writeContract: reset, isPending: isResetting } = useWriteContract();

  // Wait for click transaction
  const { isLoading: isClickLoading, isSuccess: isClickSuccess } = useWaitForTransactionReceipt({
    hash: clickHash,
  });

  // Wait for reset transaction
  const { isLoading: isResetLoading, isSuccess: isResetSuccess } = useWaitForTransactionReceipt({
    hash: resetHash,
  });

  // Refetch data when transactions complete
  useEffect(() => {
    if (isClickSuccess) {
      refetchTotalClicks();
      refetchUserClicks();
    }
  }, [isClickSuccess, refetchTotalClicks, refetchUserClicks]);

  useEffect(() => {
    if (isResetSuccess) {
      refetchTotalClicks();
      refetchUserClicks();
    }
  }, [isResetSuccess, refetchTotalClicks, refetchUserClicks]);

  // Refetch data when session transactions complete
  useEffect(() => {
    if (isSessionSuccess) {
      refetchTotalClicks();
      refetchUserClicks();
    }
  }, [isSessionSuccess, refetchTotalClicks, refetchUserClicks]);

  // Check if current user is owner
  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  // Enhanced click function that uses session if available
  const handleClick = async () => {
    if (isSessionValid) {
      // Use session key for transaction
      try {
        await executeWithSession('click');
      } catch (error) {
        console.error('Session click failed, falling back to regular click:', error);
        // Fallback to regular click
        click?.({
          address: CLICKER_ADDRESS,
          abi: CLICKER_ABI,
          functionName: 'click',
        });
      }
    } else {
      // Use regular click
      click?.({
        address: CLICKER_ADDRESS,
        abi: CLICKER_ABI,
        functionName: 'click',
      });
    }
  };

  // Enhanced reset function that uses session if available
  const handleReset = async () => {
    if (isOwner) {
      if (isSessionValid) {
        // Use session key for transaction
        try {
          await executeWithSession('reset');
        } catch (error) {
          console.error('Session reset failed, falling back to regular reset:', error);
          // Fallback to regular reset
          reset?.({
            address: CLICKER_ADDRESS,
            abi: CLICKER_ABI,
            functionName: 'reset',
          });
        }
      } else {
        // Use regular reset
        reset?.({
          address: CLICKER_ADDRESS,
          abi: CLICKER_ABI,
          functionName: 'reset',
        });
      }
    }
  };

  return {
    // Data
    totalClicks: totalClicks || BigInt(0),
    userClicks: userClicks || BigInt(0),
    owner,
    isOwner,
    
    // Session data
    sessionConfig,
    isSessionValid,
    isCreatingSession,
    isExecutingSession,
    isSessionLoading,
    isSessionSuccess,
    sessionClient,
    
    // Actions
    click: handleClick,
    reset: handleReset,
    createNewSession,
    revokeCurrentSession,
    
    // Loading states
    isClicking: isClicking || isClickLoading || isExecutingSession,
    isResetting: isResetting || isResetLoading,
    isClickSuccess,
    isResetSuccess,
    
    // Connection
    isConnected,
    address,
    agwClient,
  };
} 