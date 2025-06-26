// AbstractCounter Contract Configuration
// This file contains the contract address and ABI for the deployed AbstractCounter

export const ABSTRACT_COUNTER_ADDRESS = "0x70D3C2CC6a32312408a032Cd130cB060e486AC34" as const;

export const ABSTRACT_COUNTER_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "BelowMinValue",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExceedsMaxValue",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SameValue",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Unauthorized",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "previousValue",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "CounterUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "previousValue",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "CounterReset",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      }
    ],
    "name": "adminSetCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "iterations",
        "type": "uint256"
      }
    ],
    "name": "batchIncrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "incrementBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      }
    ],
    "name": "setCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Network configuration for Abstract Testnet
export const ABSTRACT_TESTNET = {
  chainId: 11124,
  name: "Abstract Testnet",
  rpcUrl: "https://api.testnet.abs.xyz",
  blockExplorer: "https://testnet.abscan.org",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};

// Contract interaction functions
export const contractFunctions = {
  // Read functions
  getCounter: () => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'getCounter',
  }),
  
  owner: () => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'owner',
  }),

  // Write functions
  increment: () => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'increment',
  }),

  incrementBy: (amount: bigint) => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'incrementBy',
    args: [amount],
  }),

  setCounter: (newValue: bigint) => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'setCounter',
    args: [newValue],
  }),

  resetCounter: () => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'resetCounter',
  }),

  batchIncrement: (iterations: bigint) => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'batchIncrement',
    args: [iterations],
  }),

  withdrawETH: (amount: bigint) => ({
    address: ABSTRACT_COUNTER_ADDRESS,
    abi: ABSTRACT_COUNTER_ABI,
    functionName: 'withdrawETH',
    args: [amount],
  }),
}; 