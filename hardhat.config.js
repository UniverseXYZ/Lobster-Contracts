require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
require('dotenv').config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
      ropsten: {
        url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
        accounts: [process.env.WALLET_PK]
      },
      mainnet: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        accounts: [process.env.WALLET_PK]
      },
    },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
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
  // abiExporter: {
  //   path: './abis',
  //   clear: true,
  //   flat: true,
  //   spacing: 2
  // }
};
