import React, { useState } from 'react';
import { useAccount } from 'wagmi';

interface AbstractCounterUIProps {
  contractAddress: string;
}

export const AbstractCounterUI: React.FC<AbstractCounterUIProps> = ({ contractAddress }) => {
  const { address, isConnected } = useAccount();
  const [counterValue, setCounterValue] = useState<number>(0);
  const [newValue, setNewValue] = useState<number>(0);
  const [incrementAmount, setIncrementAmount] = useState<number>(1);
  const [batchAmount, setBatchAmount] = useState<number>(5);

  const handleIncrement = () => {
    // This would be replaced with actual contract interaction
    setCounterValue(prev => prev + 1);
  };

  const handleSetCounter = () => {
    setCounterValue(newValue);
  };

  const handleIncrementBy = () => {
    setCounterValue(prev => prev + incrementAmount);
  };

  const handleBatchIncrement = () => {
    setCounterValue(prev => prev + batchAmount);
  };

  const handleReset = () => {
    setCounterValue(0);
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Abstract Counter</h2>
        <p className="text-gray-600">Please connect your wallet to interact with the contract.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Abstract Counter</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Contract Address:</p>
        <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
          {contractAddress}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Current Value:</p>
        <p className="text-3xl font-bold text-blue-600">{counterValue}</p>
      </div>

      <div className="space-y-4">
        {/* Basic Increment */}
        <div>
          <button
            onClick={handleIncrement}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Increment (+1)
          </button>
        </div>

        {/* Set Counter */}
        <div className="flex gap-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="New value"
          />
          <button
            onClick={handleSetCounter}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Set
          </button>
        </div>

        {/* Increment By */}
        <div className="flex gap-2">
          <input
            type="number"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Amount"
          />
          <button
            onClick={handleIncrementBy}
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Batch Increment */}
        <div className="flex gap-2">
          <input
            type="number"
            value={batchAmount}
            onChange={(e) => setBatchAmount(Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Batch amount"
          />
          <button
            onClick={handleBatchIncrement}
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            Batch Add
          </button>
        </div>

        {/* Reset */}
        <div>
          <button
            onClick={handleReset}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Reset Counter
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>
    </div>
  );
}; 