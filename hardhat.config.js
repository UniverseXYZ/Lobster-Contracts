require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
      ropsten: {
        url: "https://ropsten.infura.io/v3/40c2813049e44ec79cb4d7e0d18de173",
        accounts: ['695d7686360e0d8a26d7616b938accf78071d849ecb5301ab6b39323bb5f7d0b']
      }
    },
  etherscan: {
    apiKey: "7IGHYYTNI36RTR2S3IE4XABKK5GB27A9R3"
  },
  solidity: {
    compilers: [
      {
        version: "0.7.4",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  abiExporter: {
    path: './artifacts/abis',
    clear: true,
    flat: true,
    spacing: 2
  }
};