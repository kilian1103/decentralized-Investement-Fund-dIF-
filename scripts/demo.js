const ethers = require('ethers');
require('dotenv').config();

async function main() {

    const url = process.env.RINKEBY_URL;
    let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");
    const provider = new ethers.providers.JsonRpcProvider(url);
    let privateKey = process.env.PRIVATE_KEY;
    let wallet = new ethers.Wallet(privateKey, provider);


    const address = "0x6f2eF6ffEd22c6565534c5526E2546Df03d3e6eb"
    const dif = new ethers.Contract(address, artifacts.abi, wallet);

    // await dif.buyIn({value: ethers.utils.parseEther("0.5"), gasLimit: 10 ** 7})
    // await dif.voteBuyAndStake(false, {gasLimit: 10 ** 7});
    //await dif.voteBuyAndStake(true, {gasLimit: 10 ** 7});


    await dif.voteCashOutAndDestroy(true, {gasLimit: 10 ** 7});

    //buy coins
    const LINK_ADDRESS = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; // LINK COIN
    const UNISWAP_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // UNISWAP COIN
    const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'; // DAI COIN

    let name_array = ['DAI', 'UNISWAP', 'LINK'];
    let address_array = [DAI_ADDRESS, UNISWAP_ADDRESS, LINK_ADDRESS];

    let tx = await dif.addCoins(name_array, address_array);
    await tx.wait();

    //show assets
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