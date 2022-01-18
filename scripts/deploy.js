const ethers = require('ethers');
hre = require('hardhat');
require('dotenv').config();

async function main() {

  const url = process.env.RINKEBY_URL;

  let artifacts = await hre.artifacts.readArtifact("dInvestmentFund");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);



  let owners = ['0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1', '0xfE0b8d9aC9CCb38574dfA98751256F479A9e888C'];

  let dif = await factory.deploy();

  await dif.deployed(); 

  console.log("Fund address:", dif.address);
  console.log(dif)

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


  console.log("...");
  console.log("Buying coins: ", name_array);
  console.log("...");


  tx = await dif.diversifyAndStake({gasLimit : 10**7});
  await tx.wait();


  let fundinfo = await dif.showAssetList({gasLimit : 10**7});



  console.log("...");
  console.log("YOUR ASSETS ARE");
  console.log("...");
  console.log("COINNAMES: ", fundinfo._coin_names);
  console.log("BALANCE: ", fundinfo._coin_assets.map(x => x.toString()));
  console.log("LIQUIDITY: ", fundinfo._liquidity_coin_assets.map(x => x.toString()));
  console.log("...");

  console.log("...");
  console.log("BUYING COIN DAI");
  console.log("...");

  tx = await dif.buyCoin('DAI', ethers.utils.parseEther('0.01'),{gasLimit : 10**7});
  await tx.wait();
 
 
 
  fundinfo = await dif.showAssetList({gasLimit : 10**7});


  console.log("...");
  console.log("YOUR ASSETS ARE");
  console.log("...");
  console.log("COINNAMES: ", fundinfo._coin_names);
  console.log("BALANCE: ", fundinfo._coin_assets.map(x => x.toString()));
  console.log("LIQUIDITY: ", fundinfo._liquidity_coin_assets.map(x => x.toString()));
  console.log("...");



  console.log("...");
  console.log("SELLING EVERYTHING");
  console.log("...");

  tx = await dif.cashOutAndDestroy({gasLimit : 10**7});
  await tx.wait();

  console.log("Contract destroyed!")

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});