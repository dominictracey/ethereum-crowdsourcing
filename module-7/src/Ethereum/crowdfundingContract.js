import { web3 } from "./web3";
import crowdfundingABI from "./crowdfundingABI";

export function createContract(contractAddress) {
    return new web3.eth.Contract(crowdfundingABI,contractAddress);
}

