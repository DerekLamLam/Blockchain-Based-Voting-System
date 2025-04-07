Blockchain Voting System README
===============================

This is a decentralized voting application DApp built using Ethereum, Solidity, Truffle, Ganache, and a simple web frontend. It allows users to vote for candidates securely on a blockchain, ensuring transparency and immutability. This README provides step-by-step instructions to set up and use the system on Windows 10/11.

---

Prerequisites
-------------
Before you begin, ensure you have the following installed:
1. Node.js and npm:
   - Download and install from https://nodejs.org/.
   - Verify installation: Open Command Prompt (cmd) and run:
     > node -v
     > npm -v
2.Truffle:
   - Install globally via npm:
     > npm install -g truffle
   - Verify: > truffle version
3. Ganache:
   - Download from https://trufflesuite.com/ganache/ and install.
4. MetaMask:
   - Install the browser extension from https://metamask.io/ 
5. A Web Browser: Chrome or Firefox recommended.


---
Project Setup
-------------
Step 1: Download the Project
- Download the ZIP file and extract it to a folder, it cant upload two folder to github: node_modules,test. But there are in the ZIP file.

Step 2: Install Dependencies
- Open Command Prompt and navigate to the project folder
- Install project dependencies:
  > npm install
- Install lite-server for the frontend:
  > npm install lite-server --save-dev

Step 3: Deploy the Smart Contract
- Start Ganache:
- Open the Ganache app.
- Create a new workspace or use "Quickstart".
- Ensure the RPC Server is running at `HTTP://127.0.0.1:7545` (port 7545).
- Deploy the contract:
- In Command Prompt (in the project folder):
  > truffle migrate --network development
- Update the contract address
- In Command Prompt (in the project folder):
  > npm run deploy

Step 4: Connect MetaMask to Ganache
- Open MetaMask in your browser.
- Add a custom network:
- Click the network dropdown > "Add Network" > "Add a network manually".
- Settings:
- Network Name: Ganache
- RPC URL: http://127.0.0.1:7545
- Chain ID: 1337
- Currency Symbol: ETH
- Save and switch to the "Ganache" network.
- Import an account:
- In Ganache, go to the "Accounts" tab, click the key icon next to an account (e.g., Account 2), and copy the private key.
- In MetaMask: Click the account circle > "Import Account" > Paste the private key > Import.

Step 5: Run the Frontend
- In Command Prompt (in the project folder):
> npm start
- This starts lite-server and should open `http://localhost:3000` in your browser.
- If it doesn’t open automatically, manually go to `http://localhost:3000`.

---

How to Use the Voting DApp
--------------------------

1. Open the DApp:
- Ensure Ganache is running and MetaMask is connected to the Ganache network with an imported account.
- Visit `http://localhost:3000` in your browser.
- You should see:
 - A heading: "Voting DApp".
 - Two candidates: "Tom - Votes: 0" and "Jerry - Votes: 0".

2. Cast a Vote:
- Click the "Vote" button next to a candidate (Tom).
- MetaMask will pop up asking you to confirm the transaction.
- Click "Confirm" to vote (no real ETH is spent; Ganache uses test ETH).
- The page will refresh, and the vote count should update (e.g., "Tom - Votes: 1").

3. Verify Results:
- Each account can vote only once.
- Check the updated vote counts on the page after voting.
- After the last user votes, it automatically redirects to the result page​.
- Result Page displays the winner, and the total number of votes received

4. Reset the Voting:
- The 'Reset Voting' button allows restarting the process with a new contract​
- The 'Reset Voting' button can only be used by the contract owner​(first one)
- After clicking it, it redirects back to the voting page to start a new round​
