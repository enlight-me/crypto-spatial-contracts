# Crypto Spatial Contracts

[![GitHub license](https://img.shields.io/github/license/enlight-me/crypto-spatial-contracts)](https://github.com/allilou/onchain-land-administration/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/enlight-me/crypto-spatial-contracts)](https://github.com/allilou/onchain-land-administration/issues)
[![GitHub stars](https://img.shields.io/github/stars/enlight-me/crypto-spatial-contracts)](https://github.com/allilou/onchain-land-administration/stargazers)
[![GitHub stars](https://img.shields.io/github/forks/enlight-me/crypto-spatial-contracts)](https://github.com/allilou/onchain-land-administration/network/members)

Solidity smart contracts for Geospatially Enabled Decentralized Applications on the Ethereum blockchain.

This project aims to implements geospatial data management features, on the Blockchain technology, which is an open research subject at the [Open Geospatial Consortium](http://docs.opengeospatial.org/dp/18-041r1/18-041r1.html) where a [Blockchain and Distributed Ledger Technologies Domain Working Group](https://www.opengeospatial.org/projects/groups/bdltdwg) has been created especially for that.

Table of contents
=================
<!--ts-->
* [Setup](#setup)
* [Usage](#Usage)
* [Implementation details](#implementation-details)
* Project related documentation
  * [User stories](./docs/user_stories.md)
  * [Design pattern decisions](./docs/design_pattern_decisions.md)
  * [Avoiding common attacks (security)](./docs/avoiding_common_attacks.md)
* [Further Reading](#further-reading)
<!--te-->

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
npm install @truffle/hdwallet-provider @openzeppelin/contracts@2.5.0 truffle-assertions
truffle migrate --reset --network develop
```

For the rinkeby testnet (put your seed phrase in a text file on solidity/.secret):

```bash
truffle migrate --network rinkeby
```

## Usage

See the [decentralized-land-admin](https://github.com/enlight-me/decentralized-land-admin) project for a complete implementation.

## Implementation details

The FOAM protocole, developped by [FOAM space](https://foam.space/) was implemented using the [White Paper](https://foam.space/publicAssets/FOAM_Whitepaper.pdf) with a set of solidity smart contracts. Some modifications was implemented to explore the alternatives suggested by the [OGC discussion paper ($7.5)](http://docs.opengeospatial.org/dp/18-041r1/18-041r1.html)

For the Crypto-Spatial Coordinates, a conforming implementation of the [Geodesic Discrete Global Grid Systems](http://webpages.sou.edu/~sahrk/sqspc/pubs/gdggs03.pdf) OGC standard has been used in place of Geohash used by the FOAM protocole.

## Further Reading

## Proof of Location on blockchain

- [FOAM Space Public Research](https://github.com/f-o-a-m/public-research)
- [dPoL: A Peer-to-Peer Digital Location System](https://medium.com/@kierstenJ/dpol-a-peer-to-peer-digital-location-system-af623f4e0a10)
- [Blockchain Consensus Encyclopedia / Proof of Location](https://github.com/cedricwalter/blockchain-consensus/blob/master/chain-based-proof-of-capacity-space/dynamic-proof-of-location.md)
- [Platin Proof of Location on the Blockchain](https://youtu.be/Wx2cCUYbQuE)
- [How to Enable a Smart Contract to Get Real-World Location Data](https://www.howtotoken.com/for-developers/enable-a-smart-contract-to-get-real-world-location-data/)
- [XYO Network : An open, secure crypto-location oracle network](https://github.com/XYOracleNetwork)

## Blockchain business models

- [McKinsey : Blockchain beyond the hype: What is the strategic business value?](https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/blockchain-beyond-the-hype-what-is-the-strategic-business-value#)
- [Top 7 Blockchain Business Models That You Should Know About](https://101blockchains.com/blockchain-business-models/)
