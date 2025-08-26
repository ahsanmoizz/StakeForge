import { ethers } from 'ethers';

// Replace this with your contract's ABI and address
const contractAddress = '0x10333EB571603Ae276c462F765e3Fadcf4d75d25'; // Your deployed contract address
const contractABI = [
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





  


let provider;
let signer;
let contract;

const connectWallet = async () => {
  // Check if window.ethereum is available (i.e., MetaMask is installed)
  if (window.ethereum) {
    try {
      // Initialize the provider and signer
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      // Request account access from MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create the contract instance
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log('Connected to wallet!');
      
      return { provider, signer, contract };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  } else {
    console.error('MetaMask not detected. Please install it.');
    alert('Please install MetaMask to connect your wallet.');
  }
};

export default connectWallet;
