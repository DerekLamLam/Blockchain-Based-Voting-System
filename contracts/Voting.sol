// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    address public owner;
    address[] public voterList;
    uint public voteCount; 

    event Voted(uint candidateId);
    event ResetVoting();
    event VotingFinished(uint totalVotes); 

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        addCandidate("Tom");
        addCandidate("Jerry");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        voterList.push(msg.sender);
        candidates[_candidateId].voteCount++;
        voteCount++; 

        emit Voted(_candidateId);

        if (voteCount == 5) {
            emit VotingFinished(voteCount);
        }
    }

    function getVoteCount() public view returns (uint) {
        return voteCount;
    }

    function reset() public onlyOwner {
        for (uint i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
        for (uint i = 0; i < voterList.length; i++) {
            voters[voterList[i]] = false;
        }
        delete voterList;
        voteCount = 0;
        emit ResetVoting();
    }
}