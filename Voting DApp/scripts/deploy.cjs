const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("Voting deployed to:", address);

  // Prepare clean data for frontend
  const contractData = {
    address: address,
    abi: JSON.parse(Voting.interface.formatJson())
  };

  const frontendDir = path.join(__dirname, "../frontend");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir);
  fs.writeFileSync(
    path.join(frontendDir, "contract.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("ABI and address written to frontend/contract.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
