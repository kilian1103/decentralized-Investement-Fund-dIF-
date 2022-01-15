hre = require('hardhat');
const ethers = require('ethers');
require('dotenv').config();

const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH_ADDRESS = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
const DAI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; 


const url = process.env.RINKEBY_URL;
const provider = new ethers.providers.JsonRpcProvider(url);
let privateKey = process.env.PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey, provider);

const amountIn = ethers.utils.parseUnits('0.5', 'ether');




async function main() {
  const admin = await wallet.address;
  
  const WethArt = await hre.artifacts.readArtifact('Weth');
  const WethABI = WethArt.abi;
  const weth = new ethers.Contract(WETH_ADDRESS, WethABI, wallet);

  const DaiArt = await hre.artifacts.readArtifact('Dai');
  const DaiABI = DaiArt.abi;
  const dai = new ethers.Contract(DAI_ADDRESS, DaiABI, wallet);

  const RouterArt = await hre.artifacts.readArtifact('Router');
  const RouterABI = RouterArt.abi;
  const router = new ethers.Contract(ROUTER_ADDRESS, RouterABI, wallet);


  const balanceDaiBefore = await dai.balanceOf(admin ,{gasLimit : 10**6});

  await weth.deposit({value: amountIn}) 
  await weth.approve(router.address, amountIn);
  

  let amountsOut = await router.getAmountsOut(amountIn, [WETH_ADDRESS, DAI_ADDRESS]);

  let amountOutMin = amountsOut[1]
      .mul(ethers.BigNumber.from(50))
      .div(ethers.BigNumber.from(100));

  

  await router.swapExactTokensForTokens(
    amountIn, 
    amountOutMin,
    [WETH_ADDRESS, DAI_ADDRESS],
    admin,
    Math.floor((Date.now() / 1000)) + 60 * 10,
    {gasLimit : 10**6}
  );

  // function wait(ms){
  //   var start = new Date().getTime();
  //   var end = start;
  //   while(end < start + ms) {
  //     end = new Date().getTime();
  //  }}
  
  // wait(20000);
  let balanceDaiAfter = amountsOut[1].add(balanceDaiBefore);
  //let balanceDaiAfter = await dai.balanceOf(admin,{gasLimit : 10**6});
  // const executionPerf = balanceDaiAfter.sub(balanceDaiBefore).div(amountsOut[1]);
  // console.log(executionPerf.toString());
  console.log("Dai before: ",balanceDaiBefore.toString());
  console.log("Dai after: ",balanceDaiAfter.toString());
/////////////////////////////////////////////////////////
  




  await dai.approve(router.address, balanceDaiAfter);

  amountsOut = await router.getAmountsOut(balanceDaiAfter, [DAI_ADDRESS, WETH_ADDRESS]);

  amountOutMin = amountsOut[1]
      .mul(ethers.BigNumber.from(90))
      .div(ethers.BigNumber.from(100));


    const receipt = await router.swapExactTokensForTokens(
    balanceDaiAfter, // ether -> dai weil input
    amountOutMin, //dao---> weth 
    [DAI_ADDRESS, WETH_ADDRESS],
    admin,
    Math.floor((Date.now() / 1000)) + 60 * 10,
    {gasLimit : 10**6}
  );

  
  // wait(20000);

  // let wethbalance = await weth.balanceOf(admin,{gasLimit : 10**6});
  
  let wethbalance = amountsOut[1];

  await weth.withdraw(wethbalance,{gasLimit : 10**7});



}




main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});


