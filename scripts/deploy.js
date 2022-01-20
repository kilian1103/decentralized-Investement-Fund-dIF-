const ethers = require('ethers');
require('dotenv').config();

async function main() {
    // mine and Timos address
    //const owners_array = ["0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1", "0xfE0b8d9aC9CCb38574dfA98751256F479A9e888C"];
    const owners_array = ["0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1"];
    let numberOfConf = 1;
    let buyInAmount = "0.02";


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