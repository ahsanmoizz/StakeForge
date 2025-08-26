import React, { useState } from 'react';
import { ethers } from 'ethers';

const ERC20MOCK_CONTRACT_ADDRESS = "0x32fCbF45083D05bDfFc95cd84bA809ed346876d6"; // The ERC20 token contract address
const STAKING_CONTRACT_ADDRESS = '0x10333EB571603Ae276c462F765e3Fadcf4d75d25'; // The Staking contract address

// ABI for the ERC20 token contract
const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ABI for the Staking contract
const STAKING_ABI =[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_platform",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_platform",
        "type": "address"
      }
    ],
    "name": "updatePlatform",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balance",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakingEndTime",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakingStartTimes",
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
    "name": "platform",
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
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Staked",
    "outputs": [],
    "stateMutability": "event",
    "type": "event"
  }
]


const Stake = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [retry, setRetry] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum);

  const sanitizeInput = (input) => {
    return input.trim().replace(/^['"]|['"]$/g, ''); // Clean up the input string
  };

  const stakeTokens = async () => {
    setLoading(true);
    setStatus('');
    try {
      // Sanitize and validate input
      const sanitizedAmount = sanitizeInput(amount);
      const sanitizedDuration = sanitizeInput(duration);

      const numericAmount = parseFloat(sanitizedAmount);
      const numericDuration = parseInt(sanitizedDuration, 10);

      if (isNaN(numericAmount) || isNaN(numericDuration)) {
        throw new Error('Please enter valid values for amount and duration.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      console.log("Wallet connected:", await signer.getAddress());

      // Get token contract and staking contract instances
      const tokenContract = new ethers.Contract(ERC20MOCK_CONTRACT_ADDRESS, ERC20_ABI, signer);
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);

      // Approve the staking contract to transfer the tokens
      const amountBN = ethers.parseUnits(numericAmount.toString(), 18);
      const txApprove = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amountBN);
      console.log("Approve transaction sent:", txApprove);

      await txApprove.wait();

      // Stake the tokens
      const txStake = await stakingContract.stake(amountBN, numericDuration);
      console.log("Staking transaction sent:", txStake);

      await txStake.wait();
      setStatus(`Successfully staked ${numericAmount} tokens for ${numericDuration} seconds`);

      setLoading(false);
      setRetry(false); // Reset retry if successful
    } catch (error) {
      console.error("Error during staking:", error);
      setStatus(`Error during staking: ${error.message}`);
      setLoading(false);
      setRetry(true); // Enable retry option after failure
    }
  };

  return (
    <div>
      <h2>Stake Tokens</h2>

      {/* Input for amount */}
      <input
        type="text"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Input for duration */}
      <input
        type="text"
        placeholder="Duration in seconds"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      {/* Stake button */}
      <button onClick={stakeTokens} disabled={loading}>
        {loading ? "Processing..." : retry ? "Retry Staking" : "Stake Tokens"}
      </button>

      {/* Status message */}
      <p>Status: {status}</p>
    </div>
  );
};

export default Stake;
