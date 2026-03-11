const hre = require("hardhat");

async function main() {
  console.log("📋 Hardhat Test Accounts\n");
  console.log("These are the accounts available on your local Hardhat network:\n");

  const accounts = await hre.ethers.getSigners();

  for (let i = 0; i < 5; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    console.log(`Account #${i}:`);
    console.log(`  Address:     ${account.address}`);
    console.log(`  Balance:     ${hre.ethers.formatEther(balance)} ETH`);
    console.log("");
  }

  console.log("⚠️  IMPORTANT:");
  console.log("   Account #0 should be: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  console.log("   Private Key:          0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("");
  console.log("   If you see a DIFFERENT address for Account #0, your Hardhat");
  console.log("   configuration might be using a different mnemonic.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
