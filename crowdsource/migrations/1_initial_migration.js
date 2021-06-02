const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

// const TestCrowdFundingWithDeadline = artifacts.require("TestCrowdfundingWithDeadline");

// module.exports = function (deployer) {
//   let beneficiary = deployer;
//   let contractCreator = deployer;
//   deployer.deploy(TestCrowdFundingWithDeadline("funding",
//   1,
//   10,
//   beneficiary,
//   {
//       from: contractCreator,
//       gas: 2000000
//   }));
// };
