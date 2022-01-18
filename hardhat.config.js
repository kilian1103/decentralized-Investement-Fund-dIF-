require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
    solidity: "0.8.4",
    networks: {
        rinkeby: {
            url: process.env.RINKEBY_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        kovan: {
            url: process.env.KOVAN_URL,
            accounts: [process.env.PRIVATE_KEY]
        }

    }
};