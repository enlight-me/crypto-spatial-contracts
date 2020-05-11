/*
 * @dev test file for CFeaureRegistry.sol
 * 
*/

let catchRevert = require("./exceptionHelpers").catchRevert;
const truffleAssert = require('truffle-assertions');
var TestRegistry = artifacts.require("./crypto-spatial/TestRegistry.sol");
var CSFeature = artifacts.require("./crypto-spatial/CSFeature.sol");

contract('TestRegistry', function (accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  const h3Resolution = 15;
  const featureRegistryName = "Test Registry";
  const srs = "EPSG:6666";

  const dggsIndex1 = web3.utils.toHex("8f283470d921c65"); // must be 15 bytes
  const dggsIndex2 = web3.utils.toHex("8f28347ad921c65");

  const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary');

  const GeometryType = {POINT : 0, CURVE : 1, SURFACE : 2};
  
  beforeEach(async () => {
    instance = await TestRegistry.new(featureRegistryName, h3Resolution, srs);
  });


  it("Should return the correct initial values of the state variables", async () => {
    let returnedName = await instance.name();
    let returnedH3Res = await instance.h3Resolution();
    let returnedSrs = await instance.srs();

    assert.equal(returnedName, featureRegistryName, "The feature name should be " + featureRegistryName);
    assert.equal(returnedH3Res, h3Resolution, "The resolution should be " + h3Resolution);
    assert.equal(returnedSrs, srs, "The SRS should be " + srs);
  });


  it("Should log an avent with the correct CSC when a new Feature is added", async () => {
    const index = web3.utils.soliditySha3({ type: 'address', value: owner },
                                          { type: 'bytes15', value: dggsIndex1 });

    const result = await instance.claimFeature(dggsIndex1, wkbHash);

    const expectedEventResult = { csc: index };

    const logAddFeature = result.logs[2].args.csc;

    assert.equal(expectedEventResult.csc, logAddFeature, "LogAddFeature event not emitted with the correct CSC, check ClaimFeature method");
  });
  
  it("Should emit a LogNewFeatureAdded event when a feature is Claimed", async () => {
    let eventEmitted = false
    const tx = await instance.claimFeature(dggsIndex1, wkbHash);

    if (tx.logs[2].event == "LogNewFeatureAdded") {
      eventEmitted = true;
    }

    assert.equal(eventEmitted, true, 'Claiming a feature should emit a LogNewFeatureAdded event')
  });

  it("Shouldn't allow adding new feature with the an existing dggsIndex", async () => {
    // The registry shouldn't allow two features with the same dggsIndex
    await instance.claimFeature(dggsIndex1, wkbHash);
    await truffleAssert.fails(instance.claimFeature(dggsIndex1, wkbHash), truffleAssert.ErrorType.REVERT);
  });

  it("Should set the correct values for the new claimed feature", async () => {
    const result1 = await instance.claimFeature(dggsIndex1, wkbHash);
    const result2 = await instance.claimFeature(dggsIndex2, wkbHash);

    const count = await instance.getFeatureCount();
    assert.equal(count, 2, "The features count should be 2");

    const csc1 = result1.logs[2].args.csc;
    const csc2 = result2.logs[2].args.csc;

    assert.notEqual(csc1, csc2, "The two CSCs shouldn't be equal");

    const feature1Address = await instance.getFeature(csc1);
    const feature2Address = await instance.getFeature(csc2);

    const feature1 = await CSFeature.at(feature1Address);
    const feature2 = await CSFeature.at(feature2Address);
    var feature1Values = await feature1.fetchFeature();
    var feature2Values = await feature2.fetchFeature();
    
    assert.equal(feature1Values[0], csc1, "The feature csc should be " + csc1);
    assert.equal(feature1Values[1], dggsIndex1, "The dggsIndex should be " + dggsIndex1);
    assert.equal(feature1Values[2], wkbHash, "The wkbHash should be " + wkbHash);
    assert.equal(feature1Values[3], owner, "The owner is set to incorrect value");
    assert.equal(feature1Values[4], h3Resolution, "The resolution should be " + h3Resolution);
    assert.equal(feature1Values[5], GeometryType.POINT, "The GeometryType should be POINT");

    assert.equal(feature2Values[0], csc2, "The feature csc should be " + csc2);
    assert.equal(feature2Values[1], dggsIndex2, "The dggsIndex should be " + dggsIndex2);
    assert.equal(feature2Values[2], wkbHash, "The wkbHash should be " + wkbHash);
    assert.equal(feature2Values[3], owner, "The owner is set to incorrect value");
    assert.equal(feature2Values[4], h3Resolution, "The resolution should be " + h3Resolution);
    assert.equal(feature2Values[5], GeometryType.POINT, "The GeometryType should be POINT");
  });



  it("Should returns true if dggsIndex exist in the registry", async () => {
    await instance.claimFeature(dggsIndex1, wkbHash);
    assert.equal(await instance.dggsIndexExist(dggsIndex1), true, "False returned for an existing dggsIndex");
  });

 
  it("Should returns the correct address of the dggsIndex owner", async () => {
    await instance.claimFeature(dggsIndex1, wkbHash, { from: alice });
    assert.equal(await instance.dggsIndexOwner(dggsIndex1), alice, "Returned address do not correspond to the dggsIndex owner");

    await instance.claimFeature(dggsIndex2, wkbHash, { from: bob });
    assert.equal(await instance.dggsIndexOwner(dggsIndex2), bob, "Returned address do not correspond to the dggsIndex owner");
  });


  it("Should returns the owner of the feature", async () => {
    const result = await instance.claimFeature(dggsIndex1, wkbHash, { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);
    const feature = await CSFeature.at(featureAddress);
    var parcelValues = await feature.fetchFeature();

    assert.equal(parcelValues[3], alice, "The returned value do not correspond to the owner");
  });

  it("Should revert if the caller is not an Admin", async () => {
    const result = await instance.claimFeature(dggsIndex1, wkbHash, { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);
    const feature = await CSFeature.at(featureAddress);

    await truffleAssert.passes(feature.setWkbHash(wkbHash, { from: alice }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(feature.setWkbHash(wkbHash, { from: bob }), truffleAssert.ErrorType.REVERT);
    
  });

  it("Should allow killing a feature by admins and log LogFeatureKilled", async () => {
    const result = await instance.claimFeature(dggsIndex1, wkbHash, { from: alice });

    const csc = result.logs[2].args.csc;

    const featureAddress = await instance.getFeature(csc);

    await truffleAssert.passes(CSFeature.at(featureAddress));

    await truffleAssert.fails(instance.removeFeature(csc, { from: bob }));

    const tx = await instance.removeFeature(csc, { from: alice }); // may test for owner too

    let eventEmitted = false
    if (tx.logs[0].event == "LogFeatureRemoved") {
      eventEmitted = true
    }

    assert.equal(eventEmitted, true, 'Removing a feature should emit a LogFeatureRemoved event')

    // no code should exist at the removed feature address
    await truffleAssert.fails(CSFeature.at(featureAddress));

  });

});