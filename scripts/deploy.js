const ethers = require('ethers');
require('dotenv').config();

async function main() {

    const owners_array = ["FILL IN YOUR WALLET"]; // Put your wallet address in here
    let numberOfConf = 1; // number of vote confirmations of a decision
    let buyInAmount = "0.02"; // buy in amount into contract


    const url = process.env.RINKEBY_URL;
    let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");
    const provider = new ethers.providers.JsonRpcProvider(url);
    let privateKey = process.env.PRIVATE_KEY;
    let wallet = new ethers.Wallet(privateKey, provider);
    let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);
    let dif = await factory.deploy(owners_array, numberOfConf, ethers.utils.parseEther(buyInAmount), {
        value: ethers.utils.parseEther('0.00'),
        gasLimit: 10 ** 7
    });
    await dif.deployed();
    console.log("Contract deployed at: ", dif.address);

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });