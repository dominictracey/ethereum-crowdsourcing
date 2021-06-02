let CrowdFundingWithDeadline = artifacts.require('TestCrowdFundingWithDeadline');

contract('TestCrowdFundingWithDeadline', accounts => {

        let contract;
        let beneficiary = accounts[2];
        let contractCreator = accounts[1];

        const ONE_ETH = web3.utils.toBN(1000000000000000000);
        const DEADLINE = web3.utils.toBN(600);
        const ERROR_MSG = "Returned error: VM Exception while processing transaction: revert";
        const SUCCEEDED_STATE = web3.utils.toBN(2);
        const FAILED_STATE = web3.utils.toBN(1);
        const PAID_OUT_STATE = web3.utils.toBN(3);
        const ZERO_ETH = web3.utils.toBN(0);

        beforeEach(async function() {
            contract = await CrowdFundingWithDeadline.new(
                "funding",
                1,
                10,
                beneficiary,
                {
                    from: contractCreator,
                    gas: 2000000
                }
            )
        })

        it ('contract is initialized', async function() {
            let campaignName = await contract.name.call();
            expect(campaignName).to.equal("funding");

            let targetAmount = await contract.targetAmount.call();
            expect(targetAmount).to.eql(ONE_ETH);

            let actualBeneficiary = await contract.beneficiary.call();
            expect(actualBeneficiary).to.equal(beneficiary);

            let fundingDeadline = await contract.fundingDeadline.call();
            expect(fundingDeadline.toNumber()).to.equal(600);

            let state = await contract.state.call();
            expect(state.valueOf().toNumber()).to.eql(0);
        }) 

        it ('funds are contributed', async function() {
            await contract.contribute({
                value: 1000000000000000000,
                from:contractCreator
            })

            // let contributed = contract.amounts.call(contractCreator);
            // expect(contributed.valueOf()).to.equal(ONE_ETH);

            let totalCollected = await contract.totalCollected.call();
            expect(totalCollected).to.eql(ONE_ETH);


        })

        it ('cannot contribute after deadline', async () => {
            try {
                await contract.setCurrentTime(700);

                await contract.sendTransaction({
                    value: ONE_ETH,
                    from:contractCreator
                });
                expect.fail();
            } catch (error) {
                expect (error.message).to.equal(ERROR_MSG);
            }
            
        })

        it ('crowdfunding successful', async () => {
            await contract.contribute({
                value: ONE_ETH,
                from: contractCreator
            });

            await contract.setCurrentTime(601);
            await contract.finishCrowdFunding();
            let state = await contract.state.call();

            expect (state.valueOf()).to.eql(SUCCEEDED_STATE);
        })

        it ('crowdfunding failed', async () => {

            await contract.setCurrentTime(601);
            await contract.finishCrowdFunding();
            let state = await contract.state.call();

            expect (state.valueOf()).to.eql(FAILED_STATE);
        })

        it ('collected money paid out', async () => {
            await contract.contribute({
                value: ONE_ETH,
                from: contractCreator
            });

            await contract.setCurrentTime(601);
            await contract.finishCrowdFunding();

            let initAmount = await web3.eth.getBalance(beneficiary);
            await contract.collect({from: contractCreator});

            let newBalance = await web3.eth.getBalance(beneficiary);
            let contrib = newBalance - initAmount;
            expect (contrib).to.eql(1000000000000000000);

            let fundingState = await contract.state.call();
            expect (fundingState.valueOf()).to.eql(PAID_OUT_STATE);
        })

        it ('withdraw funds from the contract', async () => {
            await contract.contribute({
                value: ONE_ETH - 100,
                from: contractCreator
            });

            await contract.setCurrentTime(601);
            await contract.finishCrowdFunding();

            await contract.withdraw({from: contractCreator});

            let amount = await contract.amounts.call(contractCreator);

            expect (amount.valueOf().toNumber()).to.eql(0);

        })

        it ('event is emitted', async () => {
            //let watcher = contract.CampaignFinished();

            await contract.setCurrentTime(601);
            await contract.finishCrowdFunding();

             //let events = await watcher.get();
            let event = events[0];

            expect (event.args.totalCollected).to.eql(ZERO_ETH);
            expect (event.args.succeeded).to.equal(false);

        })

})