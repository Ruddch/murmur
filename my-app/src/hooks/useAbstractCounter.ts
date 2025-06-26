import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { 
  ABSTRACT_COUNTER_ADDRESS, 
  contractFunctions 
} from '../contracts/AbstractCounter';

export const useAbstractCounter = () => {
  const { address, isConnected } = useAccount();
  const [counterValue, setCounterValue] = useState<number>(0);
  const [isOwner, setIsOwner] = useState(false);

  // Read contract data
  const { data: currentCounter, refetch: refetchCounter } = useReadContract({
    address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
    abi: contractFunctions.getCounter().abi,
    functionName: 'getCounter',
  });

  const { data: contractOwner } = useReadContract({
    address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
    abi: contractFunctions.getCounter().abi,
    functionName: 'owner',
  });

  // Write contract functions
  const { writeContract, isPending } = useWriteContract();

  // Update local state when contract data changes
  useEffect(() => {
    if (currentCounter !== undefined) {
      setCounterValue(Number(currentCounter));
    }
  }, [currentCounter]);

  useEffect(() => {
    if (contractOwner && address && typeof contractOwner === 'string') {
      setIsOwner(contractOwner.toLowerCase() === address.toLowerCase());
    }
  }, [contractOwner, address]);

  // Helper functions
  const handleIncrement = () => {
    writeContract({
      address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
      abi: contractFunctions.getCounter().abi,
      functionName: 'increment',
    });
  };

  const handleSetCounter = (value: number) => {
    writeContract({
      address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
      abi: contractFunctions.getCounter().abi,
      functionName: 'setCounter',
      args: [BigInt(value)],
    });
  };

  const handleIncrementBy = (amount: number) => {
    writeContract({
      address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
      abi: contractFunctions.getCounter().abi,
      functionName: 'incrementBy',
      args: [BigInt(amount)],
    });
  };

  const handleResetCounter = () => {
    if (isOwner) {
      writeContract({
        address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
        abi: contractFunctions.getCounter().abi,
        functionName: 'resetCounter',
      });
    }
  };

  const handleBatchIncrement = (iterations: number) => {
    writeContract({
      address: ABSTRACT_COUNTER_ADDRESS as `0x${string}`,
      abi: contractFunctions.getCounter().abi,
      functionName: 'batchIncrement',
      args: [BigInt(iterations)],
    });
  };

  return {
    // State
    counterValue,
    isOwner,
    isConnected,
    address,
    contractAddress: ABSTRACT_COUNTER_ADDRESS,
    
    // Loading states
    isLoading: isPending,
    
    // Actions
    increment: handleIncrement,
    setCounter: handleSetCounter,
    incrementBy: handleIncrementBy,
    resetCounter: handleResetCounter,
    batchIncrement: handleBatchIncrement,
    
    // Utilities
    refetchCounter,
  };
}; 