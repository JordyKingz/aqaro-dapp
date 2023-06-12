<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import MortgagePool from "@/chain/MortgagePool";
import {ethers} from "ethers";

const store = walletConnectionStore();
const ethAmount = ref('');

const contractBalance = ref('0');
const stakedBalance = ref('0');

onBeforeMount(async() => {
    await getMortgagePoolBalance();
    await getStakedBalance();
});

async function getMortgagePoolBalance() {
    const contract = new MortgagePool(store.chainId);
    await contract.getContractBalance()
        .then((response: any) => {
            contractBalance.value = ethers.utils.formatEther(response.toString());
        })
        .catch((error: any) => {
            console.log(error);
        })
}

async function getStakedBalance() {
    const contract = new MortgagePool(store.chainId);
    await contract.getStakedBalance(store.connectedWallet)
        .then((response: any) => {
            stakedBalance.value = ethers.utils.formatEther(response.toString());
        }).catch((error: any) => {
            console.log(error);
        });
}

async function provideLiquidity() {
    const contract = new MortgagePool(store.chainId);
    await contract.provideMortgageLiquidity(Number(ethAmount.value))
        .then(async (response: any) => {
            await response.wait(1);
            await getMortgagePoolBalance();
            ethAmount.value = '';
        })
        .catch((error: any) => {
            console.log(error);
        })
}
</script>
<template>
    <div class="bg-gray-900">
        <div class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-6">
                    <div class="col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">Mortgage Providers</h2>
                        <p class="mt-6 text-blue-500">
                            Text below is a placeholder for the content that will be added to this page.
                            <br>
                            <i>
                                Text "How Mortgages Work" is better written than below. Change/shorten text?
                            </i>
                        </p>
                        <p class="mt-6">
                            Are you looking for a way to earn passive income on your ETH holdings? Look no further than Aqaro!
                            Our platform offers liquidity providers the opportunity to earn a generous return on investment by staking their ETH in our mortgage pool.
                            With a competitive 10% APY, staking your ETH on Aqaro is a smart and lucrative investment.
                        </p>
                        <p class="mt-8">
                            Our platform uses the ETH provided by liquidity providers to offer mortgages to potential buyers.
                            As the mortgages are paid off with interest, the returns go directly back to the liquidity providers, allowing you to earn a significant return on your investment without lifting a finger.
                        </p>
                        <p class="mt-8">
                            Staking your ETH on Aqaro is easy and straightforward.
                            Simply provide your ETH to the liquidity pool, and you will begin earning rewards immediately.
                            The more ETH you stake, the higher your rewards will be.
                            And with our transparent and secure platform, you can rest assured that your investment is safe and protected.
                        </p>
                        <p class="mt-8">
                            Join the Aqaro community today and start earning passive income on your ETH holdings.
                            With our innovative platform and competitive 10% APY, we are creating a more accessible, transparent, and equitable housing market for everyone.
                        </p>
                        <div class="mt-5">
                            <a href="#" class="text-base font-semibold leading-7 text-indigo-500">Show Contract On Etherscan <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </div>
                    <div class="col-span-3 text-gray-400">
                        <div class="bg-gray-900 shadow rounded-lg py-6 px-5">
                            <div>
                                <h2 class="text-2xl font-bold tracking-tight text-gray-300 ">Total ETH Staked</h2>
                                <p>
                                    {{ contractBalance }} ETH
                                </p>
                            </div>
                            <div class="w-full mt-6">
                                <label class="text-gray-300 w-full text-xl">Provide ETH Liquidity</label>
                                <input
                                        type="text"
                                        class="bg-white/5 w-full px-4 py-3 mt-2 focus:ring-indigo-600 focus:ring-offset-gray-900 rounded-lg placeholder-gray-400 text-gray-300"
                                        v-model="ethAmount"
                                        placeholder="Enter amount of ETH to stake">
                            </div>
                            <div class="text-center w-full mt-4">
                                <button v-if="Number(ethAmount) && Number(ethAmount) > 0" v-on:click="provideLiquidity" class="px-2 py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white">
                                    Provide ETH Liquidity
                                </button>
                                <button v-else class="px-2 cursor-not-allowed py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg">
                                    Provide ETH Liquidity
                                </button>
                            </div>
                        </div>
                        <div v-if="Number(contractBalance) && Number(contractBalance) > 0" class="bg-gray-900 shadow mt-6 rounded-lg py-6 px-5">
                            <div class="w-full">
                                <div class="flex">
                                    <div>
                                        <label class="text-gray-300 w-full text-xl">Provided Liquidity</label>
                                        <p class="text-gray-300 text-xl">{{ stakedBalance }} ETH</p>
                                        <div class="w-full mt-4">
                                            <button v-if="Number(ethAmount) && Number(ethAmount) > 0" v-on:click="provideLiquidity" class="px-2 py-2 w-full border-2 border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white">
                                                Claim Rewards
                                            </button>
                                            <button v-else class="px-2 w-full cursor-not-allowed py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg">
                                                Claim Rewards
                                            </button>
                                        </div>
                                    </div>
                                    <div class="pl-6">
                                        <label class="text-gray-300 w-full text-xl">Earned</label>
                                        <p class="text-gray-300 text-xl">(earned) ETH</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mx-auto px-6 text-white py-24 max-w-7xl">
                Connect Wallet to become a Mortgage Provider
            </div>
            <div class="bg-gray-900">
                <div class="text-white px-6 py-24 lg:px-8">
                    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
                        <p class="text-base font-semibold leading-7 text-indigo-600">Mortgage Liquidity</p>
                        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">How Mortgages Work</h1>
                        <p class="mt-6 text-xl leading-8">
                            Aqaro is a decentralized housing market that leverages blockchain technology and decentralized finance (DeFi) to create a more transparent and accessible way of buying and selling real estate.
                            By removing intermediaries and utilizing a decentralized autonomous organization (DAO) to handle mortgage requests, Aqaro is able to offer a more secure and equitable platform for users.
                        </p>
                        <p class="mt-6">
                            One of the unique features of Aqaro is its DeFi model, which relies on the pooling of liquidity from multiple investors to provide mortgages for potential buyers.
                            Users who provide Ether liquidity for the mortgage pool can earn a generous return on their investment, with a competitive 10% APY.
                            As the mortgages are paid off with interest, the returns go directly back to the liquidity providers, allowing you to earn a significant return on your investment without lifting a finger.
                        </p>
                        <p class="mt-6">
                            To list their properties on Aqaro, users simply need to create a smart contract that includes all relevant details such as the property's location, price, and documentation.
                            Potential buyers can then browse the listings and make offers directly to the seller. Aqaro offers users the option to apply for mortgages, which are handled by the Aqaro DAO.
                            The DAO assesses the borrower's creditworthiness and offers them a mortgage, which is also recorded on the blockchain.
                        </p>
                        <p class="mt-6">
                            The Aqaro DAO plays a crucial role in the platform's operation, acting as a decentralized lender that assesses mortgage requests and provides loans without the need for traditional banks.
                            The DAO operates using a set of rules and guidelines that are coded into the blockchain, ensuring that all transactions are transparent and equitable.
                            This model not only allows for greater accessibility to mortgages but also benefits investors by providing higher returns on their investments.
                        </p>
                        <p class="mt-6">
                            At Aqaro, we are committed to creating a more secure and efficient decentralized housing market that benefits all stakeholders.
                            By leveraging innovative technology and risk management solutions, we are able to create a platform that provides greater access to mortgages and offers a lucrative investment opportunity for liquidity providers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
