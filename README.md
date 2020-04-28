# Crypto Spatial Contracts

Solidity smart contracts for Geospatially Enabled Decentralized Applications on the Ethereum blockchain

## Setup

Clone this GitHub repository.

```bash
git clone https://github.com/enlight-me/crypto-spatial-contracts.git
```

Since the project is developped using the [truffle framework](https://www.trufflesuite.com/), you should check the network configuration in `truffle-config.js` before continuing.

If you haven't yet setup developpement envirenment :

```bash
npm install -g ganache-cli
npm install -g truffle
```

Launch etheruem local developpement node :

```bash
ganche-cli
```

Install smart contracts dependecies (OpenZeppelin libraries) and migrate the solidity contracts to your local EVM.

```bash
cd solidity
npm install @truffle/hdwallet-provider @openzeppelin/contracts@2.5.0 truffle-assertions
truffle migrate --reset --network develop
```

For the rinkeby testnet (put your seed phrase in a text file on solidity/.secret):

```bash
truffle migrate --network rinkeby
```
