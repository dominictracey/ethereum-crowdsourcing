pragma solidity ^0.4.24;
import "./CrowdfundingWithDeadline.sol";

contract TestCrowdFundingWithDeadline is CrowdFundingWithDeadline{
    uint time;

    constructor (
        string contractName,
        uint targetAmountEth,
        uint durationInMin,
        address beneficiaryAddress
    )  CrowdFundingWithDeadline(
        contractName,targetAmountEth,
        durationInMin, beneficiaryAddress) public {

    }

    function currentTime() internal view returns(uint) {
 //       console.log("asked for time. It's " + time);
        return time;
    }

    function setCurrentTime(uint _time) public {
        time = _time;
    }
}