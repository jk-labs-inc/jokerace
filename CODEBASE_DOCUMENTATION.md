# Such.lol Codebase Documentation

## Project Overview

**Such.lol** is a full-stack decentralized application (dApp) for creating and managing on-chain contests and competitions. It's a Farcaster-centric deployment of JokeRace, specifically customized for the Degen L3 blockchain ecosystem.

**License:** AGPL-3.0-only

---

## Technology Stack

### Smart Contracts
- **Solidity** ^0.8.19
- **Foundry/Forge** - Testing and development framework
- **Hardhat** - Secondary tooling
- **OpenZeppelin Contracts** v4.9
- **Audited by:** Certik (September 2023)

### Frontend
- **Next.js 14** (React 18) with App Router
- **TypeScript** 5.0.4
- **Tailwind CSS** - Custom design system
- **PWA** - Progressive Web App capabilities

### Blockchain Integration
- **wagmi** v2 - React hooks for Ethereum
- **viem** v2 - TypeScript Ethereum library
- **RainbowKit** v2 - Wallet connection UI
- **ethers.js** v5.6.8

### State Management & Data
- **Zustand** 4.3.5 - State management
- **TanStack Query (React Query)** v5
- **Supabase** - PostgreSQL database for indexing

### Additional Libraries
- **TipTap** - Rich text editor
- **AWS S3 SDK** - File storage via R2
- **MerkleTreeJS** - Allowlist functionality
- **Lens Protocol** - Social integration

---

## Repository Structure

```
such.lol/
├── packages/
│   ├── forge/                          # Smart Contracts Package
│   │   ├── src/
│   │   │   ├── Contest.sol            # Main contest contract (v4.28)
│   │   │   ├── modules/
│   │   │   │   └── RewardsModule.sol  # Rewards distribution
│   │   │   └── governance/            # Governor pattern contracts
│   │   │       ├── Governor.sol       # Core governance logic
│   │   │       ├── extensions/        # Modular extensions
│   │   │       │   ├── GovernorCountingSimple.sol
│   │   │       │   ├── GovernorModuleRegistry.sol
│   │   │       │   └── GovernorEngagement.sol
│   │   │       └── utils/
│   │   │           ├── GovernorMerkleVotes.sol
│   │   │           └── GovernorSorting.sol
│   │   ├── test/                      # Foundry tests
│   │   ├── lib/                       # Dependencies
│   │   └── foundry.toml               # Foundry configuration
│   │
│   └── react-app-revamp/              # Frontend Next.js Application
│       ├── app/                       # Next.js 14 app directory
│       │   ├── page.tsx              # Home page
│       │   ├── layout.tsx            # Root layout
│       │   ├── contest/              # Contest routes
│       │   ├── contests/             # Contest listing
│       │   ├── user/                 # User profiles
│       │   └── api/                  # API routes
│       ├── components/               # React components
│       │   ├── _pages/              # Page-level components
│       │   │   ├── Contest/
│       │   │   ├── Create/
│       │   │   ├── Rewards/
│       │   │   ├── Submission/
│       │   │   └── User/
│       │   ├── UI/                  # Reusable UI components
│       │   ├── Header/
│       │   ├── Search/
│       │   └── tiptap/             # Rich text editor
│       ├── hooks/                   # Custom React hooks (47+ hooks)
│       │   ├── useContest/
│       │   ├── useDeployContest/
│       │   ├── useCastVotes/
│       │   └── useRewards/
│       ├── lib/                     # Business logic libraries
│       │   ├── contests/
│       │   ├── analytics/
│       │   ├── merkletree/
│       │   ├── proposal/
│       │   └── user/
│       ├── config/                  # Configuration
│       │   ├── wagmi/              # Chain configs (90+ chains)
│       │   ├── routes/
│       │   ├── links/
│       │   └── supabase/
│       ├── helpers/                # Utility functions
│       ├── types/                  # TypeScript types
│       ├── styles/                 # Global styles
│       └── public/                 # Static assets
├── .github/workflows/             # CI/CD pipelines
│   ├── forge_tests.yml
│   └── auto_rebase_main_PRs.yml
├── .husky/                        # Git hooks
├── turbo.json                     # Turborepo configuration
└── package.json                   # Monorepo root
```

---

## Core Smart Contracts

### 1. Contest.sol (v4.28)
**Location:** `/packages/forge/src/Contest.sol`

Main contest contract that manages the entire contest lifecycle:

**Features:**
- Contest lifecycle management (submission → voting → completion)
- Proposal submission handling
- Voting system with optional downvoting support
- Merkle tree-based allowlists for permissioned access
- Pay-to-submit and pay-to-vote mechanics
- Sorting/ranking of submissions
- Version-controlled bytecode/ABI for upgrades

### 2. RewardsModule.sol (v4.28)
**Location:** `/packages/forge/src/modules/RewardsModule.sol`

Handles reward distribution for contest winners:

**Features:**
- Payment splitter functionality
- Support for native tokens and ERC20s
- Rank-based reward distribution
- Pull payment model for gas efficiency
- Multiple winner support

### 3. Governor Architecture
**Location:** `/packages/forge/src/governance/`

Modular governance system with specialized components:

- **Governor.sol** - Core governance logic
- **GovernorCountingSimple.sol** - Vote counting mechanism
- **GovernorMerkleVotes.sol** - Allowlist verification
- **GovernorSorting.sol** - Ranked choice voting
- **GovernorEngagement.sol** - Monetization features
- **GovernorModuleRegistry.sol** - Module management

---

## Frontend Architecture

### Key Features

**Contest Management:**
- Multi-step contest creation wizard
- Rich text editor for submissions (TipTap)
- Real-time voting interface
- Contest discovery via Supabase indexing

**User Experience:**
- Wallet connection via RainbowKit
- Progressive Web App for mobile
- Responsive design with Tailwind CSS
- Type-safe API integration

**Social Integration:**
- **Farcaster Integration** ✅ **NEWLY IMPLEMENTED** (see [FARCASTER_INTEGRATION.md](./FARCASTER_INTEGRATION.md))
  - @farcaster/miniapp-sdk for Mini App context
  - @neynar/react for React components
  - Farcaster user authentication and profiles
  - Share contests and submissions to Warpcast
  - Interactive Frames with buttons on contest and submission pages
- Lens Protocol support ✅
- Contest Frames (submit, view, vote) ✅
- Submission Frames (vote for/against, visit) ✅

### Custom Hooks (47+)

Located in `/packages/react-app-revamp/hooks/`:

- **useContest** - Contest data fetching
- **useDeployContest** - Contest deployment
- **useCastVotes** - Voting functionality
- **useRewards** - Reward tracking and claiming
- **40+ additional hooks** for various features

---

## Platform Capabilities

### Multi-Chain Support
- **90+ blockchain networks** supported
- Ethereum mainnet and all major L2s
- L3 networks including Degen
- Configurable chain settings in `/config/wagmi/`

### Contest Features
- **Allowlist/Permissioned Contests** - Merkle tree verification
- **Pay-to-Submit** - Monetize submissions
- **Pay-to-Vote** - Weighted voting via payment
- **Downvoting** - Support for negative votes
- **Ranked Choice Voting** - Multiple submission ranking
- **Multiple Winner Support** - Distribute rewards across ranks

### Rewards
- NFT rewards
- ERC20 token rewards (e.g., $DEGEN)
- Native token rewards
- Multi-winner distributions

### Discovery & Search
- Real-time contest indexing via Supabase
- Full-text search capabilities
- Contest filtering and categorization
- User profile pages

---

## Configuration Files

### Root Configuration
- **package.json** - Monorepo workspace with Yarn
- **turbo.json** - Turborepo build pipeline
- **.gitmodules** - Git submodules for dependencies

### Smart Contract Configuration
- **foundry.toml** - Solidity 0.8.19 compiler settings
- **remappings.txt** - Import path mappings

### Frontend Configuration
- **next.config.js** - Next.js with PWA support
- **tsconfig.json** - TypeScript with path aliases
- **tailwind.config.js** - Custom design system
- **.env** - Environment variables (Supabase, WalletConnect, R2)

---

## Development Workflow

### Monorepo Structure
- Managed with **Turborepo**
- Package manager: **Yarn workspaces**
- Two main packages:
  1. `forge` - Smart contracts
  2. `react-app-revamp` - Frontend application

### CI/CD
- **Forge Tests** - Automated smart contract testing
- **Auto Rebase** - Automatic PR rebasing for main branch

### Git Hooks
- Pre-commit hooks via Husky
- Code quality checks

---

## Purpose & Use Cases

**Such.lol** enables communities to:

1. **Run Decentralized Contests**
   - Create on-chain competitions with customizable prompts
   - Set submission and voting periods
   - Configure allowlists for exclusive contests

2. **Grow Communities**
   - Engage members through submissions and voting
   - Foster participation with pay-to-engage mechanics
   - Build reputation through contest participation

3. **Distribute Rewards**
   - Distribute NFTs, tokens, or native currency
   - Support multiple winners with rank-based shares
   - Transparent, on-chain reward distribution

### Specific to Such.lol (Degen L3 Focus)
- Optimized for Farcaster social layer
- Native Degen L3 integration
- Custom contest formats and templates
- Frame-based interactions for seamless UX
- Community-driven contest creation

---

## Security & Audits

- **Audit:** Certik (September 2023)
- **Contract Version:** v4.28
- **Best Practices:**
  - Modular contract design for security
  - Pull payment pattern for rewards
  - Merkle proofs for access control
  - Gas-optimized operations

---

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Foundry (for smart contracts)
- Yarn package manager

### Environment Setup
Required environment variables in `packages/react-app-revamp/.env`:
- Supabase credentials
- WalletConnect project ID
- R2/S3 storage credentials
- Chain RPC endpoints

### Development Commands
```bash
# Install dependencies
yarn install

# Run frontend
cd packages/react-app-revamp
yarn dev

# Test smart contracts
cd packages/forge
forge test
```

---

## Key Differentiators

1. **Modular Architecture** - Extensible contract design
2. **Multi-Chain Native** - 90+ networks supported out of the box
3. **Social Integration** - Farcaster and Lens Protocol
4. **Gas Optimized** - Efficient contract design
5. **Production Ready** - Audited and battle-tested
6. **Type-Safe** - Full TypeScript coverage
7. **Modern Stack** - Next.js 14, React 18, latest blockchain libraries

---

## Project Status

- **Active Development** - Regular updates and maintenance
- **Production Deployed** - Live on Degen L3 and other networks
- **Open Source** - AGPL-3.0-only license
- **Community Driven** - Fork of JokeRace platform

---

*Last Updated: 2025-11-22*
