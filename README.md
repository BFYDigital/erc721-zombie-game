# ERC721 Zombie Game

## Table of Contents

- [About](#about)
- [Running](#running)
- [Testing](#testing)
- [Deploying to a testnet](#deployment)
- [Screenshots](#screenshots)

## About <a name="about"></a>

A zombie fighting game based on the ERC721 standard. Mint zombies, feed them and fight other zombies in this totally original game. Each zombie has it's own unique DNA which influences their appearance. Battles are directly affected by the zombie's level and how hungry they are. The higher the zombie level, the more likely they are to win, the more hungry a zombie is, the chances of losing goes up.

You can view the demo [here](http://test-blockchain.bfydigital.com/erc721-zombie/ "ERC721 Zombie Game").

## Running <a name="running"></a>

To run the application in a development enviroment:

- Copy the project using: `git clone https://github.com/BFYDigital/erc721-zombie-game`
- Install package dependencies `npm install`
- Rename `secrets.example.json` in the root to `secrets.json`
- modify the contents of `secrets.json`
- Run a local blockchain:

```bash
truffle develop
migrate
```

- Change into the client directory: `cd client`
- Install package dependencies `npm install`
- Start the project: `npm run start`

## Testing <a name="testing"></a>

- To run tests, simply run: `truffle test`

## Deploying to a testnet <a name="deployment"></a>

This project uses infura. Modify the `networks` property in `truffle-config.js` to use other providers.

- Replace the `mnemonic` property with your wallet's backup phrase
- Place you infura project key into the `infura_project_id` property.
- Run truffle's migration command

```bash
truffle migrate --network <your target network>
```

## Screenshots <a name="screenshots"></a>

![Screenshot 1](https://user-images.githubusercontent.com/98951489/157666067-b57b2a19-d20e-4bdf-b07d-bf1ae68f92c8.png)

![Screenshot 2](https://user-images.githubusercontent.com/98951489/157666373-ff16699b-e91a-4211-8a49-86fd99cb5895.png)
