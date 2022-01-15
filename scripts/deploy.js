const ethers = require('ethers')
require('dotenv').config();

async function main() {

    const url = process.env.RINKEBY_URL;

    let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");

    const provider = new ethers.providers.JsonRpcProvider(url);

    let privateKey = process.env.PRIVATE_KEY;

    let wallet = new ethers.Wallet(privateKey, provider);

    let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

    let dif = await factory.deploy({value: ethers.utils.parseEther('0.01')});

    await dif.deployed();

    console.log("Fund address:", dif.address);


    const COIN_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // UNISWAP COIN


    let tx = await dif.buyCoin(COIN_ADDRESS, ethers.utils.parseEther('0.005'))
    await tx.wait();


    let allToken = await dif.callStatic.tokenBalance(COIN_ADDRESS);
    console.log("Contract Balance: ", allToken.toString());
    
    tx = await dif.sellCoin(COIN_ADDRESS, allToken, {gasLimit: 10 ** 7});
    await tx.wait();
    await dif.CashOutAndDestroy();

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });