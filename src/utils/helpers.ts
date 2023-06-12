import {ethers} from "ethers";

import {walletConnectionStore} from "@/stores/wallet.store";

export async function connectMetaMask() {
    if ((window as any).ethereum) {
        const store = walletConnectionStore();

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);

        (window as any).ethereum.request({method: "eth_requestAccounts"})
            .then(async (accounts: string[]) => {
                store.setConnectedWallet(accounts[0]);
                store.setConnected(true);
            })
            .catch((err: any) => console.log(err))

        // @ts-ignore
        window.ethereum.on('accountsChanged', async () => {
            (window as any).ethereum.request({method: "eth_requestAccounts"})
                .then(async (accounts: string[]) => {
                    store.setConnectedWallet(accounts[0]);
                    store.setConnected(true);
                })
                .catch((err: any) => console.log(err))
        });

        (window as any).ethereum.on('chainChanged', (chainId: any) => {
            console.log('chainChanged');
            console.log(chainId);
            setChainSettings();
        });
    }
}

export function formatAddress(address: string) {
    const first = address.substring(0, 6);
    const last = address.slice(-6);
    return `${first}...${last}`;
}

export async function setChainSettings() {
    // @ts-ignore
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const network = await provider.getNetwork();
    // const store = walletConnectionStore();
    // store.setChainId(Number(network.chainId.toString()));


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const chainId = await signer.getChainId();
    const store = walletConnectionStore();
    store.setChainId(Number(chainId.toString()));
}

