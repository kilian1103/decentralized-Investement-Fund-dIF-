const ethers = require('ethers');
require('dotenv').config();

async function main() {

  const url = process.env.RINKEBY_URL;

  let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let dif = await factory.deploy();

  console.log("Faucet address:", dif.address);

  await dif.deployed();

  console.log(dif.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});