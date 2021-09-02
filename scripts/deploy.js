// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("Starting deploy...")
  const Lobster = await hre.ethers.getContractFactory("Lobster");
  const lobster = await Lobster.deploy(
    process.env.COLLECTION_NAME,
    process.env.TOKEN_NAME,
    process.env.METADATA_URI,
    process.env.DAO_ADDRESS,
    ethers.utils.parseEther(process.env.MINT_PRICE),
    process.env.LOBSTER_SUPPLY,
    process.env.BULK_BUY_LIMIT,
    process.env.ARWEAVE_ADDRESS,
    process.env.MULTISIG_ADDRESS
  );

  await lobster.deployed();

  console.log("Lobby Lobsters deployed to:", lobster.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
