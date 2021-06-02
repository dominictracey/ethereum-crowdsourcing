const _deploy_contract = require("../migrations/2_deploy_contract");

let Voter = artifacts.require("Voter");

contract ("Voter", function(accounts) {
    let voter;
    let firstAccount;

    beforeEach(async function() {
        firstAccount = accounts[0];
        voter = await Voter.new();
        await setOptions(firstAccount,["coffee","tea"]);

    })

    it ("has no votes by default", async function() {
        let votes = await voter.getVotes.call();

        expect(toNumbers(votes)).to.deep.equal([0,0]);
    });

    it ("can vote with string function", async function() {
        await voter.vote('coffee', {from:firstAccount});

        let votes = await voter.getVotes.call();

        expect(toNumbers(votes)).to.deep.equal([1,0]);
    });


    it ("can vote with uint function", async function() {
        await voter.vote(0, {from:firstAccount});

        let votes = await voter.getVotes.call();

        expect(toNumbers(votes)).to.deep.equal([1,0]);
    });

    async function setOptions(account, options) {
        for (pos in options) {
            await voter.addOption(options[pos],{from: account});
        }
        await voter.startVoting({from: account, gas: 600000});
    }

    function toNumbers(bigNumbers) {
        return bigNumbers.map((num) => {
            return num.toNumber();
        })
    }
});