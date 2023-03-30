import {ethers} from "ethers";
import {
    propertyFactoryAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/PropertyFactory.json";
export default class PropertyFactory {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    constructor(chain: number) {
        console.log(chain, propertyFactoryAddress);
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = propertyFactoryAddress;
        } else if (chain === 31337) {
            this.contractAddress = propertyFactoryAddress;
        } else {
            this.contractAddress = propertyFactoryAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getContract() {
        return this.contractInterface;
    }

    async getAllPropertyContracts() {
        return await this.contractInterface.getPropertyContracts();
    }

    async listProperty(property: any) {
        // await this.getContract();
        return await this.contractInterface.createProperty(property);
    }

    async getPropertiesForOwner() {
        return await this.contractInterface.getPropertiesForCaller();
    }

    async getPropertyCounter() {
        // await this.getContract();
        return await this.contractInterface.propertyCount();
    }

    async getPropertyInfoById(id: number) {
        // await this.getContract();
        return await this.contractInterface.propertyInfo(id);
    }
}