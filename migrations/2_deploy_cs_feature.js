const CSFeature = artifacts.require("./crypto-spatial/CSFeature");
const CSGeometryLib = artifacts.require("./crypto-spatial/CSGeometryLib");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CSGeometryLib);
  deployer.link(CSGeometryLib, CSFeature);

  const owner = accounts[0];
  const dggsIndex = web3.utils.toHex("8f283470d921c65"); // must be 15 bytes
  const h3Resolution = 15;
  const wkbHash = web3.utils.soliditySha3('This is a Well Known Binary');
  deployer.deploy(CSFeature, dggsIndex, wkbHash, owner, h3Resolution);
};
