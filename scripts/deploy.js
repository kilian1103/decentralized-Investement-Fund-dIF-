const ethers = require('ethers');
const BigNumber = require('bignumber.js');
require('dotenv').config();

async function main() {

  const url = process.env.RINKEBY_URL;

  let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let dif = await factory.deploy({value : ethers.utils.parseEther('0.02')});

  await dif.deployed(); 

  console.log("Fund address:", dif.address);

  // let artifactsCOIN = await hre.artifacts.readArtifact("Coin");
  // let artifactsFACTORY = await hre.artifacts.readArtifact("Factory");

  // let dif = await new ethers.Contract('0xcB5B66719a5416eAaC6a894c4E722f6e3CB521B7', artifacts.abi, wallet);

  const LINK_ADDRESS = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; // LINK COIN

  const UNISWAP_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // UNISWAP COIN

  const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'; // DAI COIN
  
  const coin_name = 'Dai'
  

  // const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

  // const WETH_ADDRESS = '0xc778417E063141139Fce010982780140Aa0cD5Ab';

  // const factoryEXC = await new ethers.Contract(FACTORY_ADDRESS, artifactsFACTORY.abi, wallet);

  // const coincontract = new ethers.Contract(COIN_ADDRESS, artifactsCOIN.abi, wallet);

  // let pairAddress = await factoryEXC.getPair(COIN_ADDRESS, WETH_ADDRESS);

  let name_array = ['DAI', 'UNISWAP', 'LINK'];
  let address_array = [DAI_ADDRESS, UNISWAP_ADDRESS, LINK_ADDRESS];

  let tx = await dif.addCoins(name_array,address_array);
  await tx.wait();


  // let allToken = await dif.callStatic.tokenBalance(coin_name);
  // console.log("Contract Balance before buying: ", allToken.toString());
  // console.log(".....");
  // console.log("Buying Coins...");
  // console.log(".....");
  // tx = await dif.buyCoin(coin_name, ethers.utils.parseEther('0.005'),{gasLimit : 10**7})
  // await tx.wait();
  // allToken = await dif.callStatic.tokenBalance(coin_name);
  // console.log("Contract Balance after buying: ", allToken.toString());
  // console.log(".....");

  // console.log("Staking Coins for Liquidity Mining");
  // console.log(".....");
  // tx = await dif.startMiningLiquidity(coin_name,{gasLimit : 10**7});
  // await tx.wait();

  // console.log("Removing Coins from Liquidity Mining");
  // console.log(".....");
  // tx = await dif.stopMiningLiquidity(coin_name,{gasLimit : 10**7});
  // await tx.wait();

  // allToken = await dif.callStatic.tokenBalance(coin_name);
  // console.log("Contract Balance before selling: ", allToken.toString());
  // console.log(".....");

  // console.log("Selling Coins...");
  // console.log(".....");
  // tx = await dif.sellCoin(coin_name, allToken,{gasLimit : 10**7});
  // await tx.wait();
  // allToken = await dif.callStatic.tokenBalance(coin_name);
  // console.log("Contract Balance after selling: ", allToken.toString());



  console.log("...");
  console.log("Buying coins: ", name_array);
  console.log("...");


  tx = await dif.diversifyAndStake({gasLimit : 10**7});
  await tx.wait();

  let {coin_names, coin_assets, liquidity_coin_assets} = await dif.getAssetList({gasLimit : 10**7});


  console.log("...");
  console.log("YOUR ASSETS ARE");
  console.log("...");
  console.log("COINNAMES: ", coin_names);
  console.log("BALANCE: ", coin_assets);
  console.log("LIQUIDITY: ", liquidity_coin_assets);

  console.log("...");
  console.log("Selling everything");
  console.log("...");
 
  tx = await dif.cashOutAndDestroy({gasLimit : 10**7});
  await tx.wait();


  let {coin_names2, coin_assets2, liquidity_coin_assets2} = await dif.getAssetList({gasLimit : 10**7});

  console.log("...");
  console.log("YOUR ASSETS ARE");
  console.log("...");
  console.log("COINNAMES: ", coin_names2);
  console.log("BALANCE: ", coin_assets2);
  console.log("LIQUIDITY: ", liquidity_coin_assets2);

  console.log("Warum undefined AMK?")

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});