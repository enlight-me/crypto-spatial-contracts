const TestRegistry = artifacts.require("../crypto-spatial/TestRegistry");
const CSGeometryLib = artifacts.require("./crypto-spatial/CSGeometryLib");

module.exports = function(deployer) {
  deployer.deploy(CSGeometryLib);
  deployer.link(CSGeometryLib, TestRegistry);
  const h3Resolution = 15;
  const registryName = "TestRegistry"
  const srs = "EPSG:3857" // WGS 84 / Pseudo-Mercator
  deployer.deploy(TestRegistry, registryName, h3Resolution, srs);
};
