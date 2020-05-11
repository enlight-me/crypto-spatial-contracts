pragma solidity >=0.5.0 <0.6.0;

import './CSFeatureRegistry.sol';
import './CSFeature.sol';

/**
  * Required contract since CSFeatureRegistry has no add feature function
  */
contract TestRegistry is CSFeatureRegistry {

  /// @notice constuctor
  constructor (string memory _name, uint _h3Resolution, string memory _srs) public
  CSFeatureRegistry(_name,_h3Resolution,_srs) {
    name = "Test Registry";
  }

  /**
   * Required function to add features
   */
  function claimFeature (bytes15 dggsIndex,
                       bytes32 wkbHash)
      public addFeature( dggsIndex, wkbHash, msg.sender)
      returns (bytes32) {

    CSFeature feature = new CSFeature(dggsIndex,wkbHash, msg.sender, h3Resolution);
    bytes32 csc = feature.getFeatureCSC();
    features[csc] = address(feature);
    return csc;
  }

}

