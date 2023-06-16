<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import AqaroPresale from "@/chain/AqaroPresale";
import AqaroToken from "@/chain/AqaroToken";
import {AqaroPresaleAddress} from "@/chain/config/smartContracts";
import {ethers} from "ethers";

const store = walletConnectionStore();

const tokenAmount = ref('');
const contractBalance = ref('');
const tokensSold = ref();

const tokenPrice = 0.0003;

const presaleContractBalance = 10_000_000;
const tokenBalance = ref();

onBeforeMount(async () => {
    await initPage();
});

async function initPage() {
    await getContractEthBalance();
    await getTokensSold();
    await getPresaleEndTime();
}

async function getContractEthBalance() {
  const contract = new AqaroPresale(store.getChainId);
  await contract.getEthBalance()
      .then(async (response: any) => {
          contractBalance.value = ethers.utils.formatEther(response.toString());
      })
      .catch((error: any) => {
          console.log(error);
      });
}

async function getTokensSold() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(AqaroPresaleAddress)
        .then(async (response: any) => {
            console.log(response.toString());

            const amountOfTokensFormatted = ethers.utils.formatEther(response.toString());
            tokensSold.value = presaleContractBalance - Number(amountOfTokensFormatted);
            tokenBalance.value = Number(amountOfTokensFormatted);
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function participateInPresale() {
    const contract = new AqaroPresale(store.getChainId);

    await contract.buyTokens(Number(tokenAmount.value))
        .then(async (response: any) => {
            const transactionReceipt = await response.wait(1);
            console.log(transactionReceipt);

            await initPage();
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getPresaleEndTime() {
    const contract = new AqaroPresale(store.getChainId);
    await contract.getPresaleEndDate()
        .then(async (response: any) => {
            console.log(response.toString());
            console.log(new Date(response.toString() * 1000).toLocaleString());
        })
        .catch((error: any) => {
            console.log(error);
        });
}

</script>
<template>
    <div class="bg-gray-900">
        <div class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-3">
                    <div class="col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-xl font-semibold leading-7 text-indigo-500">
                            Aqaro Staking
                        </h2>
                        <p class="mt-8">
                            Your decision to stake the tokens demonstrates your trust in us, and we deeply appreciate it.
                            It fuels our determination to continue building and refining the Aqaro platform in the coming months.
                            Together, we will revolutionize the real estate industry and create a future where buying, selling, and financing properties are seamless and empowering.
                        </p>
                        <div class="mt-5">
                            <a href="https://sepolia.etherscan.io/address/0x9605c8E762ecFa5d38b20f79131bE0580E92292b" target="_blank" class="text-base font-semibold leading-7 text-indigo-500">
                                Show Contract On (Sepolia)Etherscan <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div class="col-span-3 text-gray-400">
                        <div class="bg-gray-900 shadow rounded-lg py-6 px-5">
                            <div class="w-full">
                                <label class="text-gray-300 w-full text-xl">Amount of Tokens to Purchase</label>
                                <input
                                        type="text"
                                        class="bg-white/5 w-full px-4 py-3 mt-2 focus:ring-indigo-600 focus:ring-offset-gray-900 rounded-lg placeholder-gray-400 text-gray-300"
                                        v-model="tokenAmount"
                                        placeholder="Enter amount of Tokens to buy">
                            </div>
                            <div class="my-4">
                                ETH to pay: {{ (Number(tokenAmount) * tokenPrice).toFixed(5) }}ETH
                            </div>
                            <div>
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    {{tokenBalance}} Tokens Left For Sale
                                </div>
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    {{tokensSold}} Tokens Sold
                                </div>
                            </div>
                            <div class="text-center w-full mt-4">
                                <button v-if="Number(tokenAmount) && Number(tokenAmount) > 0" v-on:click="participateInPresale" class="px-2 py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white">
                                    Participate In Presale
                                </button>
                                <button v-else class="px-2 cursor-not-allowed py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg">
                                    Participate In Presale
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-900">
                <div class="text-white px-6 py-24 lg:px-8">
                    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
                        <p class="text-base font-semibold leading-7 text-indigo-600">Staking</p>
                        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">Earn rewards by staking your Aqaro tokens</h1>
                        <p class="mt-6 text-xl leading-8">
                            In the world of blockchain investments, the ability to earn passive income has become a sought-after feature.
                            At Aqaro, we understand the importance of rewarding our early investors. That's why we're excited to introduce our token staking program, where you can earn attractive rewards by staking your Aqaro tokens.
                            In this blog post, we'll explore how our commitment to your early investment is reflected in the allocation of 2% of the total token supply as stake rewards, distributed over a period of 60 days.
                        </p>
                        <div class="mt-16 text-gray-400 max-w-2xl">
                            <h2 class="text-2xl font-bold tracking-tight text-gray-300">Stake and Earn</h2>
                            <p class="mt-6">
                                By staking your Aqaro tokens, you unlock the potential to earn an extra interest yield on top of your initial investment.
                                We're thrilled to offer this unique opportunity to our valued investors,
                                as it aligns with our dedication to providing additional benefits to those who show trust and commitment in our project.
                            </p>
                            <p class="mt-8">
                                To demonstrate our appreciation for your early commitment to Aqaro, we have set aside 2% of the total token supply specifically for stake rewards.
                                These rewards will be distributed over a 60-day period, allowing you to enjoy the benefits of staking for an extended period.
                                It's a win-win situation where your investment works for you while contributing to the overall stability and growth of the Aqaro ecosystem.
                            </p>
                        </div>
                        <figure class="mt-16">
                            <img class="aspect-video rounded-xl bg-gray-900 object-cover" src="/aqaro_allocation.svg" alt="" />
                            <figcaption class="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
                                <InformationCircleIcon class="mt-0.5 h-5 w-5 flex-none text-gray-300" aria-hidden="true" />
                                Allocations Aqaro
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
