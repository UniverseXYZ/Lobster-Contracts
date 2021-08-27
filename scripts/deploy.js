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
	const tokenName = "Lobby Lobster";
  const tokenSymbol = "LOBSTER";
	const metadataURI = "https://us-central1-polymorphmetadata.cloudfunctions.net/lobster-images-function-ropsten?id="
	const DAOAddress = "0x75D38741878da8520d1Ae6db298A9BD994A5D241"
	const lobsterPrice = ethers.utils.parseEther("0.01");
  const lobsterSupply = 10000;
  const bulkBuyLimit = 20;
	const arweaveContainer = "";
  const multiSig = "0x75D38741878da8520d1Ae6db298A9BD994A5D241";

  const Lobster = await hre.ethers.getContractFactory("Lobster");
  const lobster = await Lobster.deploy(tokenName, tokenSymbol, metadataURI, DAOAddress, lobsterPrice, lobsterSupply, bulkBuyLimit, arweaveContainer, multiSig);

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
