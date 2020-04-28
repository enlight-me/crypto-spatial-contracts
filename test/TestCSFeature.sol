pragma solidity >=0.5.0 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import '../contracts/crypto-spatial/CSFeature.sol';

contract TestCSFeature {

    bytes15 dggsIndex = bytes15(0x386632383334373064393231633635);
    bytes32 wkbHash = bytes32(0x7892a424c5abab560ce415705cd506c30363aeaa16b97f86aa8cb6248c186b55);
    bytes32 wkbHash1 = bytes32(0x7892a424c5abab560ce415705cd506c30363aeaa16b97f86aa8cb6248c186b56);
    uint h3Resolution = 15;
    CSGeometryLib.CSGeometryType geomteryType;

  function testFetchedValuesUsingDeployedContract() public {
    CSFeature meta = CSFeature(DeployedAddresses.CSFeature());

    (bytes32 _csc, bytes15 _dggsIndex, bytes32 _wkbHash, address _owner, uint _h3Resolution,
                CSGeometryLib.CSGeometryType _geomteryType) = meta.fetchFeature();

    bool isGMPoint = (_geomteryType == CSGeometryLib.CSGeometryType.GM_POINT);
    bytes32 csc = CSGeometryLib.computeCSCIndex(msg.sender, dggsIndex);

    Assert.equal(_csc, csc, "Incorrect feature csc");
    Assert.equal(_dggsIndex, dggsIndex, "Incorrect feature dggsIndex");
    Assert.equal(_wkbHash, wkbHash, "Incorrect feature wkbHash");
    Assert.equal(_owner, msg.sender, "Incorrect feature owner");
    Assert.equal(_h3Resolution, uint(15), "H3 Resolution in not 15");
    Assert.equal(isGMPoint, true, "Geometry Type in not Point");
  }

    function testReturnedValuesUsingDeployedContract() public {
    CSFeature meta = CSFeature(DeployedAddresses.CSFeature());

    bool isGMPoint = (meta.getGeometryType() == CSGeometryLib.CSGeometryType.GM_POINT);
    bytes32 csc = CSGeometryLib.computeCSCIndex(msg.sender, dggsIndex);

    Assert.equal(meta.getFeatureCSC(), csc, "Incorrect feature csc");
    Assert.equal(meta.getFeatureDGGSIndex(), dggsIndex, "Incorrect feature dggsIndex");
    Assert.equal(isGMPoint, true, "Geometry Type in not Point");
  }

}
