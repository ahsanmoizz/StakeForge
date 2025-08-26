
  import React, { useState } from 'react';
  import { ethers } from 'ethers';
  
  const CONTRACT_ADDRESS = '0x08492f8A88939a520Bfb0FB73caaffDB4Eb3895a'; // Replace with your contract address
  const CONTRACT_ABI = [
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
    }
  ]
  
  
  
  const Reward = () => {
      const [status, setStatus] = useState('');
  
      const handlereward = async () => {
          try {
              // Check if Metamask is installed
              if (!window.ethereum) {
                  alert("Please install metamask");
                  return;
              }
  
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
              setStatus('Loading...'); // Set loading status
              
              // Call the reward function
              const transaction = await contract.reward();
              await transaction.wait(); // Wait for the transaction to be confirmed
  
              setStatus('Rewards allocated successfully!');
              alert("Rewards allocated successfully!");
          } catch (error) {
              console.error(error);
              setStatus('Failed while fetching rewards');
              alert("An error occurred while allocating rewards");
          }
      };
  
      return (
          <div className="Reward">
              <h1>Claim your rewards!</h1>
              <button onClick={handlereward}>
                  {status === 'Loading...' ? 'Processing...' : 'Claim Rewards'}
              </button>
              {status && <p>{status}</p>}
          </div>
      );
  };
  
  export default Reward;
  