const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TranscriptRegistry", function () {
  let Registry, registry, owner, registrar, other;

  beforeEach(async function () {
    [owner, registrar, other] = await ethers.getSigners();
    Registry = await ethers.getContractFactory("TranscriptRegistry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();
  });

  it("owner can add registrar and registrar can issue & verify certificate", async function () {
    await registry.connect(owner).addRegistrar(registrar.address);
    expect(await registry.registrars(registrar.address)).to.equal(true);

    const id = ethers.keccak256(ethers.toUtf8Bytes("student-12345-transcript"));
    await registry.connect(registrar).issueCertificate(id, other.address, "ipfs://QmExampleCID");
    const v = await registry.verify(id);
    expect(v[0]).to.equal(true); // exists
    expect(v[1]).to.equal(false); // not revoked
    expect(v[2]).to.equal(registrar.address); // issuer
    expect(v[3]).to.equal(other.address); // recipient
  });

  it("registrar can revoke certificate", async function () {
    await registry.connect(owner).addRegistrar(registrar.address);
    const id = ethers.keccak256(ethers.toUtf8Bytes("cert2"));
    await registry.connect(registrar).issueCertificate(id, other.address, "uri");
    await registry.connect(registrar).revokeCertificate(id);
    const v = await registry.verify(id);
    expect(v[1]).to.equal(true); // revoked
  });

  it("non-registrar cannot issue", async function () {
    const id = ethers.keccak256(ethers.toUtf8Bytes("bad"));
    await expect(registry.connect(other).issueCertificate(id, other.address, "x")).to.be.revertedWith("Only registrar");
  });
});
