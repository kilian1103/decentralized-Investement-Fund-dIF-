# decentralized App

This dAPP is written in Javascript and Solidity that utilizes the (rinkeby) Ethereum network to deploy a decentralized
Investment Fund.

We utilize hardhat, Metamask, the Alchemy API and the rinkeby test-network for development.

The main smart contract is the

```shell
dInvestmentFund.sol
```

file which uses an UniSwap interface ABI to exchange Ethers with ERC20 tokens and provide liquidity to the market. One
full cycle of the dAPP does the following:

BuyIn -> buy Coins -> vote for market making -> show assets -> sell liquidity assets -> cash out and destroy!

How to use the Code:

First deploy the contract and get its address and then run the demo to see its functionality!

```shell
npx hardhat run --network rinkeby scripts/deploy.js
npx hardhat run --network rinkeby scripts/demo.js
```

In order to deploy the contract you need to set the following environment variables in the `.env` file:

````shell
RINKEBY_URL=YOURRINKEBYURL
PRIVATE_KEY=YOURKEY
````

Furthermore, you need to add your wallet address in the `deploy.js` and after deployment add the contract address in `
demo.js` to execute the functions of the contract.

Developed by K.H. Scheutwinkel and T. Neumann
