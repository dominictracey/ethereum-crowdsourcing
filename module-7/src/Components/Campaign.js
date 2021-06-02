import React, { Component } from 'react';
import {Table, Button, Input} from 'semantic-ui-react';
import { web3 } from '../Ethereum/web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { createContract } from './../Ethereum/crowdfundingContract';

class Campaign extends Component {

    ONGOING_STATE='0';
    FAILED_STATE = '1';
    SUCEEDED_STATE = '2';
    PAID_OUT_STATE = '3';

    state = {
        campaign: {
            name: 'N/A',
            targetAmount: 0,
            totalCollected: 0,
            campaignFinished: false,
            deadline: new Date(0),
            isBeneficiary: false,
            state: '',
        },
        contributionAmount: 0
    }

    constructor(props) {
        super(props)
        this.onContribute = this.onContribute.bind(this);
        this.onEndCampaign = this.onEndCampaign.bind(this);
        this.onWithdraw = this.onWithdraw.bind(this);
        this.onCollect = this.onCollect.bind(this);
    }

    async componentDidMount() {
        const currentCampaign = await this.getCampaign(this.getCampaignAddress());
        this.setState({
            campaign: currentCampaign
        })

        const provider = await detectEthereumProvider();

        if (provider) {
        // From now on, this should always be true:
        // provider === window.ethereum
        //provider.enable()
        //startApp(provider); // initialize your app
        } else {
        console.log('Please install MetaMask!');
        }
    }

    getCampaignAddress() {
        return this.props.match.params.address;
    }

    async getCampaign(address) {
        const contract = await createContract(address)

        const name = await contract.methods.name().call();
        const targetAmount = await contract.methods.targetAmount().call();
        const totalCollected = await contract.methods.totalCollected().call();
        const beforeDeadline = await contract.methods.beforeDeadline().call();
        const beneficiary = await contract.methods.beneficiary().call();
        const deadlineSeconds = await contract.methods.fundingDeadline().call();
        const state = await contract.methods.state().call();

        var deadlineDate = new Date(0);
        deadlineDate.setUTCSeconds(deadlineSeconds);

        const accounts = await web3.eth.requestAccounts();
        const bene = accounts[0] && beneficiary.toLowerCase() === accounts[0].toLowerCase()
        return {
            name: name,
            targetAmount: targetAmount,
            totalCollected: totalCollected,
            campaignFinished: !beforeDeadline,
            deadline: deadlineDate,
            isBeneficiary: bene,
            state: state,
        }
    }
    
    render() {
        return (
            <div>
                <Table celled padded color='teal' striped>
                    <tbody>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Value</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Name</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Target Amount</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.targetAmount}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Total Collected</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.totalCollected}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Finished</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.campaignFinished}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Deadline</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.deadline.toDateString()}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>Is Beneficiary</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.isBeneficiary ? "true" : "false"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell singleLine>State</Table.Cell>
                        <Table.Cell singleLine>{this.state.campaign.state}</Table.Cell>
                    </Table.Row>
                    </tbody>
                </Table>
                {this.campaignInteractionSection()}
            </div>
        );
    }

    campaignInteractionSection() {
        if (this.state.campaign.campaignFinished) {
            return this.postCampaignInterface();
        } else {
            return this.contributeInterface();
        }
    }

    postCampaignInterface() {
        if (this.state.campaign.state === this.ONGOING_STATE) {
            return <Button type='submit' positive onClick={this.onEndCampaign}>End Campaign</Button>
        }
        if (this.state.campaign.state === this.SUCEEDED_STATE
            && this.state.campaign.isBeneficiary) {
            return <Button type='submit' onClick={this.onCollect} negative>Collect Funds</Button>
        }
        if (this.state.campaign.state === this.FAILED_STATE) {
            return <Button type='submit' onClick={this.onWithdraw} negative>Refund</Button>
        }
    }

    contributeInterface() {
        return <div>
                <Input
                    action={{
                        color:'teal',
                        content: 'Contribute',
                        onClick: this.onContribute,
                    }} 
                    actionPosition= 'left'
                    labelPosition= 'right'
                    label="ETH"
                    placeholder = '1'
                    onChange = {(e) => this.setState({contributionAmount: e.target.value})}
                />
            </div>
    }

    async onContribute(event) {
        const accounts = await web3.eth.requestAccounts();
        const amount = web3.utils.toWei(this.state.contributionAmount, 'ether');

        const contract = createContract(this.getCampaignAddress());
        await contract.methods.contribute().send({
            from: accounts[0],
            value: amount
        })

        const campaign = this.state.campaign;
        campaign.totalCollected = Number.parseInt(campaign.totalCollected) + Number.parseInt(amount);

        this.setState({campaign: campaign})
    }

    async onEndCampaign(event) {
        const accounts = await web3.eth.requestAccounts();
        const contract = createContract(this.getCampaignAddress());
        await contract.methods.finishCrowdFunding().send({
            from: accounts[0],
        })
    }

    async onWithdraw(event) {
        const accounts = await web3.eth.requestAccounts();
        const contract = createContract(this.getCampaignAddress());
        await contract.methods.withdraw().send({
            from: accounts[0],
        })
    }


    async onCollect(event) {
        const accounts = await web3.eth.requestAccounts();
        const contract = createContract(this.getCampaignAddress());
        await contract.methods.collect().send({
            from: accounts[0],
        })
    }
}

export default Campaign;