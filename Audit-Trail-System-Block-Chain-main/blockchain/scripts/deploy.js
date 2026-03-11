const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying AuditTrail contract...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy contract
  const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");
  const auditTrail = await AuditTrail.deploy();
  await auditTrail.waitForDeployment();

  const contractAddress = await auditTrail.getAddress();
  console.log("AuditTrail deployed to:", contractAddress);
  console.log("Admin (deployer):", deployer.address);

  // Save contract address and ABI for frontend
  const deploymentInfo = {
    contractAddress: contractAddress,
    chainId: 31337,
    deployer: deployer.address
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  fs.writeFileSync(
    path.join(deploymentsDir, "contract-address.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Copy ABI to deployments folder
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AuditTrail.sol/AuditTrail.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  fs.writeFileSync(
    path.join(deploymentsDir, "AuditTrail.json"),
    JSON.stringify({ abi: artifact.abi }, null, 2)
  );

  // Copy to frontend
  const frontendContractsDir = path.join(__dirname, "../../frontend/audit-trail-system/src/contracts");
  if (fs.existsSync(frontendContractsDir)) {
    fs.writeFileSync(
      path.join(frontendContractsDir, "contract-address.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    fs.writeFileSync(
      path.join(frontendContractsDir, "AuditTrail.json"),
      JSON.stringify({ abi: artifact.abi }, null, 2)
    );
    console.log("\n✅ Files copied to frontend!");
  }

  console.log("\n✅ Deployment info saved to deployments/");
  console.log("   - contract-address.json");
  console.log("   - AuditTrail.json (ABI)");
  console.log("\n📝 Admin account:", deployer.address);
  console.log("   This account has ADMIN role automatically.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
