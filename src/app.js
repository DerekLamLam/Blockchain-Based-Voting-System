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

    await loadCandidates();
  } catch (error) {
    console.error("Error in initialization:", error);
    alert("Failed to initialize: " + error.message);
  }
});

async function loadCandidates() {
  try {
    const count = await contract.methods.candidatesCount().call();
    console.log("Candidates count:", count);

    const candidatesDiv = document.getElementById("candidates");
    if (!candidatesDiv) {
      throw new Error("Candidates div not found in the DOM");
    }
    candidatesDiv.innerHTML = "";

    const hasVoted = await contract.methods.voters(accounts[0]).call();
    console.log("Has voted:", hasVoted);

    for (let i = 1; i <= count; i++) {
      const candidate = await contract.methods.candidates(i).call();
      console.log(`Candidate ${i}:`, candidate);
      const div = document.createElement("div");
      div.className = "candidate-card";
      div.innerHTML = `<span>${candidate.name} - Votes: ${
        candidate.voteCount
      }</span>
                <button onclick="vote(${candidate.id})" ${
        hasVoted ? "disabled" : ""
      }>Vote</button>`;
      candidatesDiv.appendChild(div);
    }

    const totalVotes = await contract.methods.getVoteCount().call();
    console.log("Total votes:", totalVotes);
    const voteCountDiv = document.getElementById("vote-count");
    voteCountDiv.innerHTML = `Total Votes: ${totalVotes}/5`;
    if (totalVotes >= 5) {
      window.location.href = "result.html";
    }
  } catch (error) {
    console.error("Error loading candidates:", error);
    alert("Failed to load candidates: " + error.message);
  }
}

async function vote(candidateId) {
  try {
    console.log("Attempting to vote for candidate ID:", candidateId);
    console.log("Voting with account:", accounts[0]);

    const hasVoted = await contract.methods.voters(accounts[0]).call();
    if (hasVoted) {
      throw new Error("You have already voted.");
    }

   
    const loadingSpinner = document.getElementById("loading");
    loadingSpinner.style.display = "block";

    const tx = await contract.methods
      .vote(candidateId)
      .send({ from: accounts[0] });
    console.log("Vote transaction successful:", tx);

    const totalVotes = await contract.methods.getVoteCount().call();
    console.log("Total votes after voting:", totalVotes);

    if (totalVotes >= 5) {
      window.location.href = "result.html";
    } else {
      location.reload();
    }
  } catch (error) {
    console.error("Error voting:", error);

    
    const loadingSpinner = document.getElementById("loading");
    loadingSpinner.style.display = "none";

    let errorMessage = "Unknown error";
    if (error.message) {
      if (error.message.includes("Internal JSON-RPC error")) {
        const errorData = error.message.match(
          /Internal JSON-RPC error\.\n\s*(\{.*\})/
        );
        if (errorData && errorData[1]) {
          try {
            const errorObj = JSON.parse(errorData[1]);
            errorMessage = errorObj.message || "Unknown error";
            errorMessage = errorMessage.replace("execution reverted: ", "");
          } catch (parseError) {
            console.error("Failed to parse error data:", parseError);
            errorMessage = error.message;
          }
        } else {
          errorMessage = error.message;
        }
      } else if (error.message.includes("revert")) {
        errorMessage =
          error.message.split("revert")[1]?.trim() || "Transaction reverted";
      } else {
        errorMessage = error.message;
      }
    }

    alert("Failed to vote: " + errorMessage);
  }
}
