const CSFeatureRegistry = artifacts.require("./crypto-spatial/CSFeatureRegistry");
const CSGeometryLib = artifacts.require("./crypto-spatial/CSGeometryLib");

module.exports = function(deployer) {
  deployer.deploy(CSGeometryLib);
  deployer.link(CSGeometryLib, CSFeatureRegistry);
  const h3Resolution = 15;
  const registryName = "FeatureRegistry"
  const srs = "EPSG:3857" // WGS 84 / Pseudo-Mercator
  deployer.deploy(CSFeatureRegistry, registryName, h3Resolution, srs);
};
