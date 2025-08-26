import React, { useState } from 'react';
import { ethers } from 'ethers'; // Import ethers
import wordsToNumbers from 'words-to-numbers'; // Import words-to-numbers

const ERC20MOCK_CONTRACT_ADDRESS = "0x32fCbF45083D05bDfFc95cd84bA809ed346876d6";
const STAKING_CONTRACT_ADDRESS = '0x10333EB571603Ae276c462F765e3Fadcf4d75d25';

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
  }
];

const ApproveTokens = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [retry, setRetry] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum);

  const sanitizeInput = (input) => {
    // Trim whitespace and remove unwanted quotes
    return input.trim().replace(/^['"]|['"]$/g, '');
  };

  const approveTokens = async () => {
    setLoading(true);
    setStatus('');
    try {
      // Sanitize and convert word to number
      const sanitizedInput = sanitizeInput(amount);
      const numericAmount = wordsToNumbers(sanitizedInput);

      // Validate numericAmount
      if (isNaN(numericAmount) || numericAmount === null) {
        throw new Error(`Invalid input for amount: "${sanitizedInput}". Please use a valid number or word.`);
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      console.log("Wallet connected:", await signer.getAddress());

      // Get token contract
      const tokenContract = new ethers.Contract(ERC20MOCK_CONTRACT_ADDRESS, ERC20_ABI, signer);

      // Convert numericAmount to units (18 decimals for most ERC20 tokens)
      const amountBN = ethers.parseUnits(numericAmount.toString(), 18);

      // Approve the contract to spend tokens
      const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amountBN);
      console.log("Transaction sent:", tx);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      setStatus(`Successfully approved ${numericAmount} tokens for ${STAKING_CONTRACT_ADDRESS}`);
      setApprovalStatus('Approved');
      setLoading(false);
      setRetry(false); // Reset retry if successful
    } catch (error) {
      console.error("Error during approval:", error);
      setStatus(`Error during approval: ${error.message}`);

      if (error.code === 4001) {
        setApprovalStatus('Approval Rejected by User');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setApprovalStatus('Insufficient funds for gas');
      } else {
        setApprovalStatus('Approval Failed');
      }

      setLoading(false);
      setRetry(true); // Enable retry option after failure
    }
  };

  return (
    <div>
      <h2>Approve Tokens</h2>

      {/* Input for amount */}
      <input
        type="text"
        placeholder="Amount to approve (e.g., 'eighty')"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Retry approval button */}
      <button onClick={approveTokens} disabled={loading}>
        {loading ? "Processing..." : retry ? "Retry Approval" : "Approve"}
      </button>

      {/* Show the status */}
      <p>Status: {status}</p>

      {/* Show the approval status */}
      {approvalStatus && <p><strong>{approvalStatus}</strong></p>}
    </div>
  );
};

export default ApproveTokens;
