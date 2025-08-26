📄 README.md
# 💎 StakeForge/ERC20 Token Staking DApp

A decentralized staking platform built with **Solidity**, **Truffle**, and **React (CRA)**, where users can stake ERC20 tokens and earn rewards. Early withdrawals are penalized, while completed staking periods earn bonus tokens.

---

## 🚀 Overview

This project enables users to:
- Stake ERC20 tokens for a set duration.
- Earn rewards based on staking time.
- Withdraw staked tokens (with penalty if before maturity).
- Reward distribution handled automatically via smart contract.

---

## ⚙️ Smart Contract

### Key Features
- **Staking**: Users deposit ERC20 tokens into the contract.
- **Rewards**:  
  - 2 tokens for 2-hour staking.  
  - 5 tokens for 1-day staking.  
- **Penalty System**: Early withdrawals reduce balance by 10%, sent to the platform address.
- **Admin Control**: Owner can update platform address.
- **Events**: Logs staking actions for frontend tracking.

### Tech
- Solidity `^0.8.20`
- OpenZeppelin ERC20
- Truffle (deployment)

---

## 🎨 Frontend

The frontend is a **React CRA template** providing:
- Wallet connection (MetaMask)
- Stake tokens with duration
- Claim rewards after staking period
- Withdraw tokens early with penalty info

---

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/ahsanmoizz/StakeForge.git
cd Smart-Contracts

2. Compile & Deploy Contracts
truffle compile
truffle migrate --network sepolia

3. Frontend
cd frontend
npm install
npm start

🔗 Resources

Solidity Docs

OpenZeppelin ERC20

Truffle Suite

React CRA

📜 License

This project is licensed under the MIT License.

💡 Built with ❤️ using Solidity, Truffle, and React.