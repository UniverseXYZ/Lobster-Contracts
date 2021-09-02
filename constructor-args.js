module.exports = [
  process.env.COLLECTION_NAME,
  process.env.TOKEN_NAME,
  process.env.METADATA_URI,
  process.env.DAO_ADDRESS,
  ethers.utils.parseEther(process.env.MINT_PRICE),
  process.env.LOBSTER_SUPPLY,
  process.env.BULK_BUY_LIMIT,
  process.env.ARWEAVE_ADDRESS,
  process.env.MULTISIG_ADDRESS
];