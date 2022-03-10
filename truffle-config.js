const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const secrets = require('./secrets.json');

const mnemonic = secrets.mnemonic;
const infuraProjectId = secrets.infura_project_id;

module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",

      // host: "localhost",
      // port: 8545,
      // network_id: "1337"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `wss://rinkeby.infura.io/ws/v3/${infuraProjectId}`),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    }
  },
  compilers: {
    solc: {
      version: "0.8.11",
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};
