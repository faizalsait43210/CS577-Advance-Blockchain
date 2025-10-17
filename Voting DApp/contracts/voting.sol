// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    address public owner;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        uint256 vote;
    }

    mapping(uint256 => Candidate) private candidates;
    mapping(address => Voter) private voters;
    uint256 public candidateCount;

    event CandidateRegistered(uint256 id, string name);
    event Voted(address voter, uint256 candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyRegistered() {
        require(voters[msg.sender].registered, "Not registered");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCandidate(string calldata name) external onlyOwner {
        require(bytes(name).length > 0, "Empty name");
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
        emit CandidateRegistered(candidateCount, name);
    }

    function registerVoter(address voter) external onlyOwner {
        require(!voters[voter].registered, "Already registered");
        voters[voter].registered = true;
    }

    function vote(uint256 candidateId) external onlyRegistered {
        Voter storage v = voters[msg.sender];
        require(!v.voted, "Already voted");
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid id");
        v.voted = true;
        v.vote = candidateId;
        candidates[candidateId].voteCount += 1;
        emit Voted(msg.sender, candidateId);
    }

    function getCandidate(uint256 id)
        external
        view
        returns (string memory name, uint256 votes)
    {
        require(id > 0 && id <= candidateCount, "Invalid id");
        Candidate storage c = candidates[id];
        return (c.name, c.voteCount);
    }

    function showResults()
        external
        view
        returns (uint256[] memory ids, string[] memory names, uint256[] memory votes)
    {
        ids = new uint256[](candidateCount);
        names = new string[](candidateCount);
        votes = new uint256[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            Candidate storage c = candidates[i];
            ids[i - 1] = c.id;
            names[i - 1] = c.name;
            votes[i - 1] = c.voteCount;
        }
    }

    function winner()
        external
        view
        returns (uint256 winningId, string memory winningName, uint256 winningVotes)
    {
        uint256 top = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > top) {
                top = candidates[i].voteCount;
                winningId = i;
            }
        }
        Candidate storage c = candidates[winningId];
        return (c.id, c.name, c.voteCount);
    }
}
