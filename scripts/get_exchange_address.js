hre = require('hardhat');
const ethers = require('ethers');
require('dotenv').config();

const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH_ADDRESS = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'; 
const UNIWSWAP_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';


const url = process.env.RINKEBY_URL;
const provider = new ethers.providers.JsonRpcProvider(url);
let privateKey = process.env.PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey, provider);

const amountIn = ethers.utils.parseUnits('0.01', 'ether');




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

  const UniswapArt = await hre.artifacts.readArtifact('ContractFactory');
  const UniswapABI = UniswapArt.abi;
  const uniswap = new ethers.Contract(UNISWAP_ADDRESS, UniswapABI, wallet);



}




main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});