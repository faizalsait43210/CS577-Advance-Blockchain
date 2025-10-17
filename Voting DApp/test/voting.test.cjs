const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let Voting, voting, owner, voter1, voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("owner registers candidates and voters; voting works", async function () {
    await voting.connect(owner).registerCandidate("Alice");
    await voting.connect(owner).registerCandidate("Bob");

    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).registerVoter(voter2.address);

    // voters vote
    await voting.connect(voter1).vote(1);
    await voting.connect(voter2).vote(2);

    // read results
    const result = await voting.showResults();
    const votes = result[2]; // third tuple element = votes[]
    const totalVotes = Number(votes[0]) + Number(votes[1]);
    expect(totalVotes).to.equal(2);
  });

  it("prevents double voting", async function () {
    await voting.connect(owner).registerCandidate("Alice");
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(voter1).vote(1);
    await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("Already voted");
  });

  it("only owner can register", async function () {
    await expect(
      voting.connect(voter1).registerCandidate("X")
    ).to.be.revertedWith("Only owner");
    await expect(
      voting.connect(voter1).registerVoter(voter2.address)
    ).to.be.revertedWith("Only owner");
  });
});
