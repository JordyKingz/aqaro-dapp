import {ethers} from "ethers";

import {walletConnectionStore} from "@/stores/wallet.store";

export async function connectMetaMask() {
    // @ts-ignore
    if (window.ethereum) {
        const store = walletConnectionStore();

        // @ts-ignore
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        // @ts-ignore
        ethereum.request({method: "eth_requestAccounts"})
            .then(async (accounts: string[]) => {
                console.log(accounts[0])
                store.setConnectedWallet(accounts[0]);
                store.setConnected(true);
            })
            .catch((err: any) => console.log(err))

        // @ts-ignore
        ethereum.on('accountsChanged', async () => {
            // @ts-ignore
            ethereum.request({method: "eth_requestAccounts"})
                .then(async (accounts: string[]) => {
                    store.setConnectedWallet(accounts[0]);
                    store.setConnected(true);
                })
                .catch((err: any) => console.log(err))
        });

        // @ts-ignore
        ethereum.on('chainChanged', (chainId) => {
            console.log('chainChanged');
            console.log(chainId);
            setChainSettings();
        });
    }
}

export function formatAddress(address: string) {
    const first = address.substring(0, 5);
    const last = address.slice(-4);
    return `${first}...${last}`;
}

export async function setChainSettings() {
    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const store = walletConnectionStore();
    store.setChainId(Number(network.chainId.toString()));
}

