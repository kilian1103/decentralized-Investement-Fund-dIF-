const ethers = require('ethers');
require('dotenv').config();

export async function deploy(owners_array, numberOfConf, buyInAmount) {

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

    return dif
}


deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });