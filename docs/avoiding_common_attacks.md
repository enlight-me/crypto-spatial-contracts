# Avoiding common attacks

In this document we explain the strategies used to avoid common attacks in the developpment of the solidity smart contracts of this project. The article [Solidity Security: Comprehensive list of known attack vectors and common anti-patterns](https://blog.sigmaprime.io/solidity-security.html#reentrancy) is used as a base structure.

## Table of contents

<!--ts-->
* [Strategies used to avoid common attacks](#strategies)
* [Security tools](#security-tools)
  * [MythX](#mythx)
  * [Slither](#slither)
<!--te-->

## Strategies

### Reentrancy 

In this release of the project ther is no logic involving tranferring value between addresses.
Nevertheless, We tried as much as possible to respect the best practices to avoid reentrancy as placing any code that performs external calls as the last operation. Example :

- The call to ```computeCSCIndex``` function in [CSFeature.sol](../solidity/contracts/geospatial/CSFeature.sol).

- The call to ```kill``` in the ```removeFeature``` function in [CSFeatureRegistry.sol](../solidity/contracts/geospatial/CSFeatureRegistry.sol)

### Arithmetic Over/Under Flows

To guard against under/overflow vulnerabilities we use the openZeppelin ```SafeMath``` mathematical library for the state variable ```featuresCount (uint256)``` in the [CSFeatureRegistry.sol](../solidity/contracts/geospatial/CSFeatureRegistry.sol).

### Unexpected Ether

In this release of the project ther is no logic based on ```this.balance```.
Nevertheless, as the [CSFeature.sol](../solidity/contracts/geospatial/CSFeature.sol) contract implement a ```selfdestruct``` function, even if someone send ether to it, this contract will refund all gathered Ether to the its owner.

### Delegatecall

In this release of the project we don't use ```delegatecall``` and we used the stateless ```library``` keyword to implement the [CSGeometryLib.sol](../solidity/contracts/geospatial/CSGeometryLib.sol).

### Default Visibilities

The visibility for all the contracts functions and state variables of this project contracts are clearly specified.

### Entropy (randomness) Illusion

In this release of the project we don't rely on any random variable.

### External Contract Referencing

In this release of the project we don't make calls to any untrusted externall contract.

### Short Address/Parameter Attack

To avoid this type of attack it is advised to order correctly the parameter of the functions as padding only occurs at the end.
TODO should check my contracts and well understand the problem.

### Unchecked CALL Return Values

In this release of the projec we don't use the CALL low-level function.

### Front Running

In this release of the project we believe that this type of attack is not valuable to any potenital attacker.

### Denial Of Service (DOS)

In this release of the project :

- no function loop through data structures that are artificially manipulated by external users;
- for LAParcel contract we have an array of admins(the creator and the LAParcleRegistry contract) that have acces to key state variables and functions.

### Block Timestamp Manipulation

In this release of the project we don't rely on timestamp.

### Constructors with Care

All the contracts of this project uses the ```constructor``` keyword.

### Uninitialised Storage Pointers

All the contracts of this project targets the 0.5.x version of the solidity compiler in whichthe use of memory and storage keywords are mandatory.

### Floating Points and Precision

In this release of the project we don't use fixed points values.

### Tx.Origin Authentication

In this release of the project we don't use tx.Origin.

## Security tools

### MythX

Having some trouble using the command line analysis `truffle run verify`, the MythX Visual Studio Code was used instead.
The full report highlight two low severity issues described bellow.

Detected Issues

| 0 High | 0 Medium | 2 Low |
|--------|----------|-------|

| ID | Severity |  Name | File | Location |
|----|----------|-------|------|----------|
|SWC-103| Low| Floating Pragma |CSFeatureRegistry.sol |L: 9 C: 0 |
|SWC-108 |Low|State Variable Default Visibility|CSFeatureRegistry.sol |L: 30 C: 10|

As a correction, the line of code n° 30 was updated in the commit [08231bb](https://github.com/allilou/onchain-land-administration/commit/08231bb54bbe0d7e3313cd2cca0a0c62e09d817c) as follow :

```solidity
uint256 internal featuresCount = 0;
```

### Slither

Desperate from using `mythril`, the `slither` tool was used and returns the following results.

**TODO**
