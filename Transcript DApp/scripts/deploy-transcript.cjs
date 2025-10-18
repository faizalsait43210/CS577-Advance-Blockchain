const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Registry = await ethers.getContractFactory("TranscriptRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("TranscriptRegistry deployed to:", address);

  const contractData = {
    address: address,
    abi: JSON.parse(Registry.interface.formatJson())
  };

  const frontendDir = path.join(__dirname, "../frontend-transcript");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir);
  fs.writeFileSync(path.join(frontendDir, "contract.json"), JSON.stringify(contractData, null, 2));
  console.log("ABI and address written to frontend-transcript/contract.json");
}

main().catch((e)=>{ console.error(e); process.exit(1); });
