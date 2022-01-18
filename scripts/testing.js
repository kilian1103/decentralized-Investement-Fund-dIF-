hre = require('hardhat');
const ethers = require('ethers');
require('dotenv').config();

async function main() {


    const url = process.env.RINKEBY_URL;

    let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");

    const provider = new ethers.providers.JsonRpcProvider(url);

    let privateKey = process.env.PRIVATE_KEY;

    let wallet = new ethers.Wallet(privateKey, provider);

    let contract_address = "0xe1E2Eac3220CC87e5d673eb7fd274041b6888a91";

    const deployedContract = new ethers.Contract(contract_address, artifacts.abi, wallet);

    await deployedContract.buyIn({value: ethers.utils.parseEther('0.03'), gasLimit: 10 ** 7});
    let tx = await deployedContract.voteBuyAndStake(false, {gasLimit: 10 ** 7});
    await tx.wait();
    // await deployedContract.voteCashOutAndDestroy(true,{gasLimit: 10 ** 7});

    let fundinfo = await deployedContract.showAssetList({gasLimit: 10 ** 7});
    console.log("...");
    console.log("YOUR ASSETS ARE");
    console.log("...");
    console.log("COINNAMES: ", fundinfo._coin_names);
    console.log("BALANCE: ", fundinfo._coin_assets.map(x => x.toString()));
    console.log("LIQUIDITY: ", fundinfo._liquidity_coin_assets.map(x => x.toString()));
    console.log("...");

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });