const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Checking Admin Role...\n");

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployments/contract-address.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  console.log("Contract Address:", deployment.contractAddress);
  console.log("Expected Admin:", deployment.deployer);
  console.log("");

  // Get contract instance
  const AuditTrail = await hre.ethers.getContractFactory("AuditTrail");
  const contract = AuditTrail.attach(deployment.contractAddress);

  // Check admin from contract
  const adminFromContract = await contract.admin();
  console.log("Admin from contract.admin():", adminFromContract);

  // Check role of deployer
  const roleOfDeployer = await contract.getRole(deployment.deployer);
  console.log("Role of deployer:", roleOfDeployer.toString(), getRoleName(roleOfDeployer));

  // Check if they match
  if (adminFromContract.toLowerCase() === deployment.deployer.toLowerCase()) {
    console.log("\n✅ Admin address matches deployer!");
  } else {
    console.log("\n❌ Admin address does NOT match deployer!");
  }

  if (roleOfDeployer === 1n) {
    console.log("✅ Deployer has ADMIN role!");
  } else {
    console.log("❌ Deployer does NOT have ADMIN role!");
  }
}

function getRoleName(role) {
  const roles = {
    0: "NONE",
    1: "ADMIN",
    2: "INSPECTOR",
    3: "APPROVER",
    4: "AUDITOR"
  };
  return roles[Number(role)] || "UNKNOWN";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
