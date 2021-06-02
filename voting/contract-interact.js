let fs = require('fs');
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(
    new web3.providers.HttpProvider('http://localhost:7545')
);

let contractAddress = "0x2A6695357B60937574C3fCf3E40df8EcD6e4bEaF";
//let fromAddress = "0x7985aecd8cde24f07d31143bcc11322bfa95d026";
let fromAddress = "0xDCc202b414824fA9434c8c62A21c77C60855d140";

let abiString = fs.readFileSync('abi.json','utf8');
let abi = JSON.parse(abiString);

let voter = new web3.eth.Contract(abi,contractAddress);

sendTransactions()
    .then(function () {
        console.log("Done");
    })
    .catch(function (error) {
        console.log(`Error ${error}`);
    });

async function sendTransactions() {
    console.log("add coffee option");
    await voter.methods.addOption("coffee").send({from: fromAddress});
    console.log("add tea option");
    await voter.methods.addOption("tea").send({from:fromAddress});
    console.log("start voting");
    await voter.methods.startVoting().send({from:fromAddress, gas:600000});
    console.log("voting")
    await voter.methods['vote(uint256)'](1).send({from:fromAddress, gas:600000});
    console.log("getting results");
    let votes = await voter.methods.getVotes().call({from:fromAddress});
    console.log(`votes ${votes}`);
}
