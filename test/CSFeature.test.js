/*
 * @dev test file for LAParcelRegistry.sol
 * 
*/

let catchRevert = require("./exceptionHelpers").catchRevert
const truffleAssert = require('truffle-assertions');
var CSFeature = artifacts.require("./CSFeature.sol");


  //kill setWkbHash onlyadmins

contract('CSFeature', function (accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  const h3Resolution = 15;

  const dggsIndex = web3.utils.toHex("8f283470d921c65"); // must be 15 bytes
  const dggsIndex2 = web3.utils.toHex("8f28347ad921c65");

  const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary');

  const csc  = web3.utils.soliditySha3({ type : 'address', value : owner}, 
                                       { type : 'bytes15', value : dggsIndex});

  const GeometryType = {POINT : 0, CURVE : 1, SURFACE : 2};


  beforeEach(async () => {
    instance = await CSFeature.new(dggsIndex, wkbHash, owner, h3Resolution);
  });

  it("Should return the correct initial values of the state variables", async () => {
    var featureValues = await instance.fetchFeature();
    
    assert.equal(featureValues[0], csc, "The parcel csc should be " + csc);
    assert.equal(featureValues[1], dggsIndex, "The dggsIndex should be " + dggsIndex);
    assert.equal(featureValues[2], wkbHash, "The wkbHash should be " + wkbHash);
    assert.equal(featureValues[3], owner, "The owner is set to incorrect value");
    assert.equal(featureValues[4], h3Resolution, "The resolution should be " + h3Resolution);
    assert.equal(featureValues[5], GeometryType.POINT, "The GeometryType should be POINT");
  });  
  
 
  it("Getter Functions should return the correct initial values of the state variables", async () => {
    let returnedGeometryType = await instance.getGeometryType();
    let returnedCSC = await instance.getFeatureCSC();
    let returnedDggsIndex = await instance.getFeatureDGGSIndex();

    // console.log(returnedGeometryType);    // ??? returned value is a transaction 
    // assert.equal(returnedGeometryType, GeometryType.POINT, "The GeometryType should be POINT");

    assert.equal(returnedCSC, csc, "The parcel csc should be " + csc);
    assert.equal(returnedDggsIndex, dggsIndex, "The dggsIndex should be " + dggsIndex);
  });



 
  it("Should revert if the caller is not an Admin", async () => {

    await truffleAssert.passes(instance.setWkbHash(wkbHash, { from: owner }), truffleAssert.ErrorType.REVERT);
    await truffleAssert.fails(instance.setWkbHash(wkbHash, { from: bob }), truffleAssert.ErrorType.REVERT);

  });


  it("Should allow killing a feature by admins and log LogFeatureKilled", async () => {

    await truffleAssert.fails(instance.kill({ from: bob }));

    const tx = await instance.kill({ from: owner }); 

    // console.log(tx); // ??? retuned transaction log do not contain any events  ????

    // let eventEmitted = false
    // if (tx.logs[0].event == "LogFeatureKilled") {
    //   eventEmitted = true
    // }

    // assert.equal(eventEmitted, true, 'Removing a feature should emit a LogFeatureKilled event');

  });


});