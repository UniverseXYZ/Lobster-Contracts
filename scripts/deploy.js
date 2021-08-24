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
	const arweaveContainer = "";
	const DAOAddress = "0xa8047C2a86D5A188B0e15C3C10E2bc144cB272C2"
	const lobsterPrice = ethers.utils.parseEther("0.01");
  const lobsterSupply = 10000;
  const bulkBuyLimit = 20

  const Lobster = await hre.ethers.getContractFactory("Lobster");
  const lobster = await Lobster.deploy(tokenName, tokenSymbol, metadataURI, DAOAddress, lobsterPrice, lobsterSupply, bulkBuyLimit, arweaveContainer);

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
