const CrowdFundingWithDeadline = artifacts.require("CrowdfundingWithDeadline");

module.exports = function (deployer) {
  let beneficiary = deployer;
  let contractCreator = deployer;
  deployer.deploy(CrowdFundingWithDeadline,
    "funding 2",
    1,
    10,
    "0x6dDb3486f0716FCc5EeDDECBf83c4e797e93b8D7");
};