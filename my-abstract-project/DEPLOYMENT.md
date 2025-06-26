# Abstract Testnet Deployment Guide

This guide walks you through deploying the AbstractCounter smart contract to Abstract testnet.

## Prerequisites

1. **Foundry-zksync installed** (already done)
2. **Private key** for deployment wallet
3. **ETH** in the deployer account
4. **Abscan API key** (optional, for contract verification)

## Step 1: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and add your values:
```bash
# Abstract Testnet Configuration
PRIVATE_KEY=your_private_key_here
RPC_URL=https://api.testnet.abs.xyz
CHAIN_ID=11124

# Abscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_abscan_api_key_here

# Contract Configuration
CONTRACT_NAME=AbstractCounter
CONTRACT_PATH=src/AbstractCounter.sol
```

⚠️ **Security Warning**: Never commit your `.env` file to version control!

## Step 2: Get ETH for Deployment

### Option A: Abstract Testnet Faucet
Visit [Abstract Faucet](https://faucet.abs.xyz) and claim test ETH.

### Option B: Bridge from Sepolia
Use the [Abstract Bridge](https://bridge.abs.xyz) to transfer ETH from Sepolia testnet.

## Step 3: Get Abscan API Key (Optional)

1. Visit [Abscan](https://abscan.org)
2. Create an account
3. Generate an API key
4. Add it to your `.env` file

## Step 4: Compile the Contract

```bash
forge build --zksync
```

## Step 5: Deploy to Abstract Testnet

### Method 1: Using Forge Script (Recommended)

```bash
# Load environment variables
source .env

# Deploy with verification
forge script script/DeployAbstract.s.sol:DeployAbstractScript \
    --rpc-url https://api.testnet.abs.xyz \
    --chain 11124 \
    --zksync \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.abscan.org/api \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --broadcast
```

### Method 2: Using Forge Create (Alternative)

```bash
# Load environment variables
source .env

# Deploy the contract
forge create src/AbstractCounter.sol:AbstractCounter \
    --constructor-args 0 \
    --rpc-url https://api.testnet.abs.xyz \
    --chain 11124 \
    --zksync \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.abscan.org/api \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --private-key $PRIVATE_KEY
```

## Step 6: Verify Deployment

After successful deployment, you should see output similar to:

```
=== Abstract Testnet Deployment ===
Deployer address: 0x...
Network: Abstract Testnet (Chain ID: 11124)
RPC URL: https://api.testnet.abs.xyz

=== Deployment Results ===
Contract deployed at: 0x...
Initial counter value: 0
Contract owner: 0x...

=== Testing Contract Functionality ===
After increment: 1
After setCounter(10): 10
After batchIncrement(5): 15

=== Deployment Complete ===
Contract is ready for use on Abstract Testnet!
Block explorer: https://testnet.abscan.org/address/0x...
```

## Step 7: Update Frontend Configuration

Once deployed, update your frontend application with the contract address and ABI:

### Update Contract Configuration

Create or update your frontend contract configuration:

```typescript
// contracts/AbstractCounter.ts
export const ABSTRACT_COUNTER_ADDRESS = "0x..."; // Your deployed address

export const ABSTRACT_COUNTER_ABI = [
  // Copy ABI from zkout/AbstractCounter.sol/AbstractCounter.json
];
```

### Update Network Configuration

```typescript
// networks/abstract.ts
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
```

## Step 8: Test the Deployed Contract

### Using Cast (Command Line)

```bash
# Get counter value
cast call $CONTRACT_ADDRESS "getCounter()" \
    --rpc-url https://api.testnet.abs.xyz

# Increment counter
cast send $CONTRACT_ADDRESS "increment()" \
    --rpc-url https://api.testnet.abs.xyz \
    --private-key $PRIVATE_KEY

# Set counter value
cast send $CONTRACT_ADDRESS "setCounter(uint256)" 42 \
    --rpc-url https://api.testnet.abs.xyz \
    --private-key $PRIVATE_KEY
```

### Using Frontend

Test the contract through your frontend application to ensure it's working correctly.

## Troubleshooting

### Common Issues

1. **Insufficient ETH**: Make sure your deployer account has enough ETH
2. **Invalid Private Key**: Double-check your private key
3. **Network Issues**: Verify RPC URL and chain ID
4. **Verification Failures**: Check your Abscan API key

### Error Messages

- `insufficient funds`: Add more ETH to your account
- `invalid signature`: Check your private key
- `network error`: Verify RPC URL and network connectivity

## Network Information

- **Network Name**: Abstract Testnet
- **Chain ID**: 11124
- **RPC URL**: https://api.testnet.abs.xyz
- **Block Explorer**: https://testnet.abscan.org
- **Faucet**: https://faucet.abs.xyz

## Next Steps

1. **Test thoroughly** on testnet before mainnet deployment
2. **Audit your contract** for security issues
3. **Deploy to mainnet** when ready
4. **Monitor contract** for any issues

## Support

- [Abstract Documentation](https://docs.abs.xyz)
- [Abstract Discord](https://discord.gg/abstract)
- [Abscan Documentation](https://abscan.org/docs) 