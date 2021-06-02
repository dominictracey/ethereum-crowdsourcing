let fs = require('fs');
let Web3 = require('web3');
let solc = require('solc');

let contract = compileContract();
let web3 = createWeb3();
let sender = "0x7985aecd8cde24f07d31143bcc11322bfa95d026";

deployContract(web3, contract, sender)
    .then(function() {
        console.log("deployment finished");
    })
    .catch(function(error) {
        console.log("deployment failed " + error);
    })

function compileContract() {
    let compilerInput = {
        "Voter" : fs.readFileSync("Voter.sol","utf8")
    }
 
    console.log("Compiling the contract");
    let compiledContract = solc.compile({"sources":compilerInput},1)
    console.log("Compilation complete")

    let contract = compiledContract.contracts['Voter:Voter'];
    // console.log("length " + compiledContract.contracts.length)
    let abi = contract.interface;
    fs.writeFileSync('abi.json', abi);

    return contract;
}

function createWeb3() {
    let web3 = new Web3();
    web3.setProvider(
        new web3.providers.HttpProvider('http://127.0.0.1:8545')
    );

    return web3;
}

async function deployContract(web3, contract, sender) {
    let Voter = new web3.eth.Contract(JSON.parse(contract.interface));
    let bytecode = '0x' + contract.bytecode;
    let gasEstimate = await web3.eth.estimateGas({data: bytecode});

    console.log("deploying contract");

    const contractInstance = await Voter.deploy({
        data: bytecode
    })
    .send({
        from:sender,
        gas:gasEstimate
    })
    .on('transactionHash', function(transactionHash) {
        console.log(`Transaction hash: ${transactionHash}`)
    })
    .on('transactionConfirmation', function(confirmationNumber, receipt) {
        console.log(`Transaction confirmation: ${transactionConfirmation}`)
    })

    console.log(`Contract address ${contractInstance.options.address}`)

}
