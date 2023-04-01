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

onBeforeMount(async () => {
    await initPage();
});

async function initPage() {
    await getContractBalance();
    await getTokensSold();

    await getPresaleEndTime();
}

async function getContractBalance() {
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
    await contract.getPresaleEndTime()
        .then(async (response: any) => {
            console.log(response.toString());
        })
        .catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
    <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
        <div class="grid grid-cols-8 gap-3">
            <div class="col-span-3 bg-gray-100 shadow rounded-lg p-3">
                <div class="w-full">
                    <label class="text-gray-900 w-full text-xl">Amount of Tokens to purchase</label>
                    <input
                            type="text"
                            class="bg-gray-50 w-full px-4 py-3 mt-2 rounded-lg placeholder-gray-400 text-gray-900"
                            v-model="tokenAmount"
                            placeholder="Enter amount of Tokens to buy">
                </div>
                <div class="my-4">
                    ETH to pay: {{ (tokenAmount * tokenPrice).toFixed(5) }}ETH
                </div>
                <div class="text-center w-full mt-4">
                    <button v-on:click="participateInPresale" class="px-2 py-2 border-2 border-yellow-500 text-yellow-500 rounded-lg">
                        Purchase Tokens
                    </button>
                </div>
            </div>
            <div class="col-span-5 bg-gray-100 shadow rounded-lg">
                {{contractBalance}}ETH in contract
                <br>
                {{tokensSold}} Aqaro tokens sold
            </div>
        </div>
    </div>
</template>
