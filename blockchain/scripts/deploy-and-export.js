// Deploys ReportValidator to the running node and writes a manifest the backend
// reads (contract address, deployer private key, ABI) to a shared volume.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const { ethers } = hre;

  const [deployer] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("ReportValidator");
  const contract = await Factory.deploy(deployer.address);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  // Hardhat's default node mnemonic -> account 0 == deployer (has UPLOADER_ROLE).
  const mnemonic = "test test test test test test test test test test test junk";
  const wallet = ethers.Wallet.fromPhrase(mnemonic);

  if (wallet.address.toLowerCase() !== deployer.address.toLowerCase()) {
    throw new Error(
      `Derived key (${wallet.address}) does not match deployer (${deployer.address}).`
    );
  }

  const sharedDir = process.env.SHARED_DIR || "/shared";
  fs.mkdirSync(sharedDir, { recursive: true });

  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts/contracts/medical.sol/ReportValidator.json"
  );
  fs.copyFileSync(artifactPath, path.join(sharedDir, "ReportValidator.json"));

  fs.writeFileSync(
    path.join(sharedDir, "deployment.json"),
    JSON.stringify(
      {
        contractAddress,
        privateKey: wallet.privateKey,
        deployer: deployer.address,
        rpcUrl: process.env.PUBLISHED_RPC_URL || "http://chain:8545",
      },
      null,
      2
    )
  );

  console.log("ReportValidator deployed at", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Manifest written to", sharedDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
