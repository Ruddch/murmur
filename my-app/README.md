# Abstract Global Wallet Demo App

A modern Next.js application demonstrating Abstract Global Wallet (AGW) integration with seamless user onboarding and cross-application smart contract wallet functionality.

## 🚀 Features

- **Abstract Global Wallet Integration**: Cross-application smart contract wallet powered by native account abstraction
- **Seamless Onboarding**: Familiar login methods (email, social accounts, passkeys)
- **Modern UI**: Beautiful, responsive interface with Abstract's design system
- **Sponsored Transactions**: Gasless transaction support with paymaster integration
- **TypeScript Support**: Full type safety throughout the application
- **Wagmi Integration**: Built on top of Wagmi for blockchain interactions
- **Viem Integration**: Low-level blockchain interactions with Viem

## 📦 Packages Used

- `@abstract-foundation/agw-react`: React hooks and components for AGW integration
- `@abstract-foundation/agw-client`: Wallet actions and utility functions
- `wagmi`: React hooks for Ethereum
- `viem`: TypeScript interface for Ethereum
- `next`: React framework
- `tailwindcss`: Utility-first CSS framework

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone or create the project**:
   ```bash
   npx @abstract-foundation/create-abstract-app@latest my-app
   cd my-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with AbstractWalletProvider
│   │   ├── page.tsx            # Main page with wallet integration
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── NextAbstractWalletProvider.tsx  # Abstract wallet provider wrapper
│   │   ├── wallet/
│   │   │   ├── SignInButton.tsx           # AGW login button
│   │   │   ├── ConnectedState.tsx         # Connected wallet state
│   │   │   └── SendTransaction.tsx        # Transaction demo
│   │   └── ui/
│   │       ├── BackgroundEffects.tsx      # Visual effects
│   │       └── ResourceCards.tsx          # Resource links
│   └── fonts/                  # Custom fonts
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🔧 Key Components

### AbstractWalletProvider

The main provider that wraps the application and provides AGW functionality:

```tsx
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnet } from "viem/chains";

export default function AbstractWalletWrapper({ children }) {
  return (
    <AbstractWalletProvider chain={abstractTestnet}>
      {children}
    </AbstractWalletProvider>
  );
}
```

### useLoginWithAbstract Hook

Provides login/logout functionality for AGW:

```tsx
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

export function SignInButton() {
  const { login } = useLoginWithAbstract();
  
  return (
    <button onClick={login}>
      Sign in with Abstract
    </button>
  );
}
```

### Sponsored Transactions

Demonstrates gasless transactions using AGW's paymaster:

```tsx
import { useWriteContractSponsored } from "@abstract-foundation/agw-react";

export function SendTransaction() {
  const { writeContractSponsored } = useWriteContractSponsored();
  
  const onSubmitTransaction = () => {
    writeContractSponsored({
      abi: parseAbi(["function mint(address,uint256) external"]),
      address: "0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA",
      functionName: "mint",
      args: [address, BigInt(1)],
      paymaster: "0x5407B5040dec3D339A9247f3654E59EEccbb6391",
      paymasterInput: getGeneralPaymasterInput({
        innerInput: "0x",
      }),
    });
  };
}
```

## 🌐 Networks

This demo is configured to work with:
- **Abstract Testnet**: Primary network for testing AGW functionality
- **Sepolia**: Ethereum testnet for cross-chain interactions

## 📚 Resources

- [Abstract Documentation](https://docs.abs.xyz)
- [Abstract Global Wallet Overview](https://docs.abs.xyz/abstract-global-wallet/overview)
- [GitHub Examples](https://github.com/Abstract-Foundation/examples)
- [YouTube Channel](https://youtube.com/@AbstractBlockchain)

## 🔗 Useful Links

- **Abstract Explorer**: [https://sepolia.abscan.org](https://sepolia.abscan.org)
- **Abstract Portal**: [https://portal.abstract.money](https://portal.abstract.money)
- **Abstract Discord**: [https://discord.gg/abstract](https://discord.gg/abstract)

## 🚀 Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **Railway**: Connect your GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by the Abstract team
