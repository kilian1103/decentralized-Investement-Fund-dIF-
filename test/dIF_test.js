const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test dInvestmentFund contract", function () {
  it("Should deploy fund", async function () {
    const DIF = await ethers.getContractFactory("dInvestmentFund");
    dIF = await DIF.deploy();
    await dIF.deployed();
  });

  it("Should change and print investment strategy", async function () {
    const setdIFTx = await dIF.changeStrategy("aggressive YOLO strategy");
    // wait until the transaction is mined
    await setdIFTx.wait();
    expect(await dIF.strategy()).to.equal("aggressive YOLO strategy");
  });

  it("Should list buy options", async function () {
    expect(await dIF.listInvestmentOptions()).to.equal("No coins to buy yet");
  });
});
