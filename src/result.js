let contract;
let accounts;

window.addEventListener("load", async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask!");
    }

    const web3 = new Web3(window.ethereum);
    console.log("Web3 initialized successfully");

    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Accounts:", accounts);

    if (!window.contractAddress) {
      throw new Error(
        "Contract address not found. Ensure contractAddress.js is loaded."
      );
    }
    const contractAddress = window.contractAddress;
    console.log("Contract address:", contractAddress);

    const abi = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [],
        name: "ResetVoting",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
        ],
        name: "Voted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "totalVotes",
            type: "uint256",
          },
        ],
        name: "VotingFinished",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "candidates",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [],
        name: "candidatesCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [],
        name: "voteCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "voterList",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "voters",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_candidateId",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getVoteCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [],
        name: "reset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    contract = new web3.eth.Contract(abi, contractAddress);
    console.log("Contract initialized at:", contractAddress);

    await loadResults();
  } catch (error) {
    console.error("Error in initialization:", error);
    alert("Failed to initialize: " + error.message);
  }
});

async function loadResults() {
  try {
    const count = await contract.methods.candidatesCount().call();
    console.log("Candidates count:", count);

    const resultsDiv = document.getElementById("results");
    if (!resultsDiv) {
      throw new Error("Results div not found in the DOM");
    }
    resultsDiv.innerHTML = "";

    let highestVotes = 0;
    let winners = [];

    for (let i = 1; i <= count; i++) {
      const candidate = await contract.methods.candidates(i).call();
      console.log(`Candidate ${i}:`, candidate);
      const voteCount = parseInt(candidate.voteCount);
      if (voteCount > highestVotes) {
        highestVotes = voteCount;
        winners = [candidate];
      } else if (voteCount === highestVotes && voteCount > 0) {
        winners.push(candidate);
      }
    }

    if (winners.length > 0) {
      if (winners.length === 1) {
        resultsDiv.innerHTML = `<span class="trophy">🏆</span> Winner: ${winners[0].name} - Votes: ${winners[0].voteCount}`;
      } else {
        resultsDiv.innerHTML = `<span class="trophy">🏆</span> Tie! Winners: ${winners
          .map((w) => `${w.name} (${w.voteCount} votes)`)
          .join(", ")}`;
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      resultsDiv.innerHTML = "No votes cast yet.";
    }
  } catch (error) {
    console.error("Error loading results:", error);
    alert("Failed to load results: " + error.message);
  }
}

async function resetVoting() {
  try {
    const contractOwner = await contract.methods.owner().call();
    console.log("Contract owner:", contractOwner);
    if (contractOwner.toLowerCase() !== accounts[0].toLowerCase()) {
      throw new Error("Only the contract owner can reset voting");
    }

    await contract.methods.reset().send({ from: accounts[0] });
    alert("Voting reset successfully! Reloading page...");
  
    window.location.href = "index.html";
    
  } catch (error) {
    console.error("Error resetting voting:", error);
    alert("Failed to reset voting: " + (error.message || "Unknown error"));
  }
}
