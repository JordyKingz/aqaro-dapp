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
        this.provider = new ethers.BrowserProvider(window.ethereum);

        if (chain === 1) {
            this.contractAddress = propertyFactoryAddress;
        } else if (chain === 31337) {
            this.contractAddress = propertyFactoryAddress;
        } else {
            this.contractAddress = propertyFactoryAddress;
        }
    }

    async getContract() {
        this.signer = await this.provider.getSigner();
        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
        return this.contractInterface;
    }

    async getSigner() {
        this.signer = await this.provider.getSigner();
        return this.signer;
    }

    async listProperty(property: any) {
        await this.getContract();
        return await this.contractInterface.createProperty(property);
    }

    async getPropertiesForOwner(wallet: string) {
        await this.getContract();
        return await this.contractInterface.properties(wallet);
    }

    async getPropertyCounter() {
        await this.getContract();
        return await this.contractInterface.propertyCount();
    }

    async getPropertyInfoById(id: number) {
        await this.getContract();
        return await this.contractInterface.propertyInfo(id);
    }
}