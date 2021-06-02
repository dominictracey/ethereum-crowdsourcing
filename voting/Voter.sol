pragma solidity ^0.4.24;

contract Voter {
    uint[] public votes;
    string[] public options;
    bool votingStarted;
    
    struct OptionPos {
        uint pos;
        bool exists;
    }
    
    mapping (string => OptionPos) posOfOption;
    mapping (address => bool) hasVoted;
    
    // constructor (string[] _options) public {
    //     options = _options;
    //     votes.length = options.length;
    //     for (uint i=0; i<options.length; ++i) {
    //         OptionPos memory op = OptionPos(i,true);
    //         posOfOption[options[i]] = op;
    //     }
    // }

    function addOption(string memory option) public {
        require(!votingStarted);
        options.push(option);
    }

    function startVoting() public {
        require(!votingStarted);
        //votes.length = options.length;
        for (uint i=0; i<options.length; ++i) {
            OptionPos memory op = OptionPos(i,true);
            posOfOption[options[i]] = op;
            votes.push(0);
        }
        votingStarted = true;
    }
    
    function vote(uint option) public {
        require(option >= 0 && option < options.length, "Invalid option");
        require(hasVoted[msg.sender] == false, "Already voted");
        
        votes[option] = votes[option] + 1;
        hasVoted[msg.sender] = true;
    }
    
    function vote(string memory option ) public {
        require(hasVoted[msg.sender] == false, "Already voted");
        
        OptionPos memory po = posOfOption[option];
        require (po.exists);
        votes[po.pos] = votes[po.pos] + 1;
        
        hasVoted[msg.sender] = true;
    }
    
    // function getOptions() public view returns ( string[] memory) {
    //     return options;
    // }
    
    function getVotes() public view returns ( uint[] memory) {
        return votes;
    }
    
}