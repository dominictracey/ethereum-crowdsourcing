pragma solidity ^0.4.24;

import "./Utils.sol";

contract CrowdFundingWithDeadline {

    using Utils for *;

    enum State { Ongoing, Failed, Successful, PaidOut }

    event CampaignFinished (
        address addr,
        uint totalCollected,
        bool succeeded
    );

    string public name;
    uint public targetAmount;
    uint public fundingDeadline;
    address public beneficiary;
    State public state;
    mapping(address => uint) public amounts;
    bool public collected;
    uint public totalCollected;

    modifier inState(State expectedState) {
        require (state == expectedState, "Invalid state");
        _;
    }

    constructor (
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address beneficiaryAddress
    ) {
        name = contractName;
        //targetAmount = targetAmountEth * 1 ether;
        targetAmount = Utils.etherToWei(targetAmountEth);
        //fundingDeadline = currentTime() + durationInMin * 1 minutes;
        fundingDeadline = currentTime() + Utils.minutesToSeconds(durationInMin); 
        beneficiary = beneficiaryAddress;

        state = State.Ongoing;
    }

    function currentTime() internal view returns (uint) {
        return block.timestamp;
    }

    function contribute() public payable inState(State.Ongoing) {
        require (beforeDeadline(), "No contributions after the deadline!");

        amounts[msg.sender] += msg.value;

        totalCollected += msg.value;

        if (totalCollected >= targetAmount) {
            collected = true;
        }
    }

    function finishCrowdFunding() public inState(State.Ongoing) {
        require(!beforeDeadline(), "Cannot finish campaign before the deadline");

        if (!collected) {
            state = State.Failed;
        } else {
            state = State.Successful;
        }

        emit CampaignFinished(address(this),totalCollected,collected);
    }

    function beforeDeadline() public view returns(bool) {
        return currentTime() < fundingDeadline;
    }

    function collect() public inState(State.Successful) {
        if (beneficiary.send(totalCollected)) {
            state = State.PaidOut;
        } else {
            state = State.Failed;
        }
    }

    function withdraw() public inState(State.Failed) {
        require (amounts[msg.sender] > 0, "Nothing was contributed");

        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        if (!msg.sender.send(contributed)) {
            amounts[msg.sender] = contributed;
        }
    }


}