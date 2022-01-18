const {expect} = require("chai");
const {ethers} = require("hardhat");


async function deploy(owners_array, numberOfConf, buyInAmount) {

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


owners = ["0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1", '0xfE0b8d9aC9CCb38574dfA98751256F479A9e888C'];


describe("Starting test case in Main net, prepare for deploying contract: ", function () {
    before(async function () {
        const contract = await deploy(owners, 1, "0.03")
        console.log("The contract is deployed at: ", contract.address)
    });
    // test 1
    it("AMK 1", async function () {
        expect(1).to.equal(1)

    });// test 2
    it("AMK2 ", async function () {
        expect(1).to.equal(1)

    });// test 3
    it("AMK 3", async function () {
        expect(1).to.equal(1)

    });
});


// const LINK_ADDRESS = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; // LINK COIN

// const UNISWAP_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // UNISWAP COIN

// const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'; // DAI COIN

// const coin_name = 'Dai'


// let name_array = ['DAI', 'UNISWAP', 'LINK'];
// let address_array = [DAI_ADDRESS, UNISWAP_ADDRESS, LINK_ADDRESS];

// let tx = await dif.addCoins(name_array,address_array);
// await tx.wait();