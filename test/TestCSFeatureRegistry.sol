pragma solidity >=0.5.0 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import '../contracts/crypto-spatial/CSFeatureRegistry.sol';
import '../contracts/crypto-spatial/CSFeature.sol';
import '../contracts/crypto-spatial/TestRegistry.sol';

/**
  * The Test contract
  */

contract TestCSFeatureRegistry {

    uint h3Resolution = 15;
    string name = "FeatureRegistry";
    string srs = "EPSG:3857";

    bytes15 dggsIndex = bytes15(0x386632383334373064393231633630);
    bytes15 dggsIndex1 = bytes15(0x386632383334373064393231633637);
    bytes15 dggsIndex2 = bytes15(0x386632383334373064393231633636);
    bytes32 wkbHash1 = bytes32(0x7892a424c5abab560ce415705cd506c30363aeaa16b97f86aa8cb6248c186b55);
    bytes32 wkbHash2 = bytes32(0x7892a424c5abab560ce415705cd506c30363aeaa16b97f86aa8cb6248c186b56);

  function testFetchedValuesUsingDeployedContract() public {
    CSFeatureRegistry meta = CSFeatureRegistry(DeployedAddresses.CSFeatureRegistry());

    // string memory _name, uint _h3Resolution, string memory _srs

    Assert.equal(meta.name(), name, "Incorrect feature registry name");
    Assert.equal(meta.h3Resolution(), h3Resolution, "Incorrect feature registry h3Resolution");
    Assert.equal(meta.srs(), srs, "Incorrect feature registry srs");
  }

  function testAddFeatureUsingNewContract() public {
    TestRegistry registry = new TestRegistry(name, h3Resolution, srs);
    bytes32 csc1 = registry.claimFeature(dggsIndex1, wkbHash1);
    bytes32 csc2 = registry.claimFeature(dggsIndex2, wkbHash2);

    Assert.equal(registry.getFeatureCount(), 2, "Incorrect number of features in the registry");

    Assert.notEqual(registry.getFeature(csc1), address(0), "Null address of first added feature");
    Assert.notEqual(registry.getFeature(csc2), address(0), "Null address of second added feature");

    Assert.equal(registry.dggsIndexExist(dggsIndex1), true, "Incorrect check for dggsInedex of first added feature");
    Assert.equal(registry.dggsIndexExist(dggsIndex2), true, "Incorrect check for dggsInedex of second added feature");
    Assert.equal(registry.dggsIndexExist(dggsIndex), false, "Incorrect check for dggsInedex of inexistant feature");

    // address ownerAdress = registry.dggsIndexOwner(dggsIndex1);
    Assert.equal(registry.dggsIndexOwner(dggsIndex1), address(this), "Incorrect check for onwer of the first feature");
    Assert.equal(registry.dggsIndexOwner(dggsIndex2), address(this), "Incorrect check for onwer of the second feature");
  }
  function testKillFeatureUsingNewContract() public {
    TestRegistry registry = new TestRegistry(name, h3Resolution, srs);
    bytes32 csc1 = registry.claimFeature(dggsIndex1, wkbHash1);

    Assert.equal(registry.getFeatureCount(), 1, "Features count should be 1");
    Assert.notEqual(registry.getFeature(csc1), address(0), "Null address of first added feature");

    registry.removeFeature(csc1);

    Assert.equal(registry.getFeatureCount(), 0, "Features count should be 0");
  }
}
