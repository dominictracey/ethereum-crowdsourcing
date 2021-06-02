let Utils = artifacts.require("./Utils.sol");
let CrowdFundingWithDeadline = artifacts.require("./CrowdfundingWithDeadline.sol");
let TestCrowdFundingWithDeadline = artifacts.require("./TestCrowdfundingWithDeadline.sol");

module.exports = async (deployer) => {
    await deployer.deploy(Utils);
    deployer.link(Utils,CrowdFundingWithDeadline);
    deployer.link(Utils,TestCrowdFundingWithDeadline);
}

