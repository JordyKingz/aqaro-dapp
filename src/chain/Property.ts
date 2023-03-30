import {ethers} from "ethers";
import {
    propertyFactoryAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/Property.json";
export default class Property {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    constructor(chain: number, propertyAddress: string) {
        console.log(chain, propertyFactoryAddress);
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = propertyAddress;
        } else if (chain === 31337) {
            this.contractAddress = propertyAddress;
        } else {
            this.contractAddress = propertyAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getContract() {
        return this.contractInterface;
    }

    async getPropertyInfo() {
        return await this.contractInterface.propertyInfo();
    }
}