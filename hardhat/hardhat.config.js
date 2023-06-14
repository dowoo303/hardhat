require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const pvkey =
  "0xe30d7cfa303f3f5f018409c094ac5363287dcd233ad4b27d5c4d8efa641b0615";

module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/88cd1369d4b0478b9b44c031a628b0bf`,
      accounts: [pvkey],
    },
  },
};
