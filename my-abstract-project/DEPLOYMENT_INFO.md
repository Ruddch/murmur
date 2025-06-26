# AbstractCounter Contract Deployment

## Deployment Details

**Contract**: AbstractCounter.sol  
**Network**: Abstract Testnet  
**Chain ID**: 11124  
**RPC URL**: https://api.testnet.abs.xyz  

### Contract Addresses

- **Contract Address**: `0x70D3C2CC6a32312408a032Cd130cB060e486AC34`
- **Deployer Address**: `0x773f2057f4dB4FD3D95892e6371ef701957f5Aa0`
- **Transaction Hash**: `0x0800acb8368f8b0b00c3c5053d2bd8aff1f3251924070ab157479de13aef7db9`

### Contract Features

- ✅ Account Abstraction compatible
- ✅ Gas optimized
- ✅ Access controls
- ✅ Events and error handling
- ✅ Emergency functions
- ✅ Batch operations

### Frontend Integration

The contract address has been updated in:
- `my-app/src/contracts/AbstractCounter.ts`

### Verification

To verify the contract on Abscan, you can use:
```bash
forge verify-contract 0x70D3C2CC6a32312408a032Cd130cB060e486AC34 src/AbstractCounter.sol:AbstractCounter --chain-id 11124 --etherscan-api-key YOUR_API_KEY
```

### Block Explorer

View the contract on Abstract Block Explorer:
https://testnet.abscan.org/address/0x70D3C2CC6a32312408a032Cd130cB060e486AC34

### Next Steps

1. Test the contract functions using the frontend
2. Verify the contract on Abscan (optional)
3. Deploy to mainnet when ready 

# Deployment Information

## Clicker Contract

**Contract Address:** `0x83d3e715a0230BE1A79D327e61cF5A08b7c4dc80`

**Network:** Abstract Testnet (Chain ID: 11124)

**Deployer:** `0x773f2057f4dB4FD3D95892e6371ef701957f5Aa0`

**Transaction Hash:** `0xd31ef6805b708bbe3e29857e6c1e9c5bdbd59de24852638ec7d5e9a2ddc08b69`

**Deployment Date:** June 25, 2024

### Contract Features

- **click()** - Increment user's click count
- **getLeaderboard(uint256 n)** - Get top n players with their scores
- **getUserRank(address user)** - Get specific user's rank and score
- **getTotalUsers()** - Get total number of users
- **reset()** - Reset all scores (owner only)

### Frontend Integration

The contract address has been updated in:
- `my-app/src/contracts/Clicker.ts`

### Usage

1. Connect your Abstract Global Wallet
2. Click the mur mur to earn points
3. View your position in the leaderboard
4. Compete with other players for the top spot! 