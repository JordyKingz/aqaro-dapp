<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import MortgagePool from "@/chain/MortgagePool";
import {ethers} from "ethers";

const store = walletConnectionStore();
const ethAmount = ref('');

const contractBalance = ref('0');

onBeforeMount(async() => {
    await getMortgagePoolBalance();
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

async function provideLiquidity() {
    const contract = new MortgagePool(store.chainId);
    await contract.provideMortgageLiquidity(Number(ethAmount.value))
        .then((response: any) => {
            console.log(response);
        })
        .catch((error: any) => {
            console.log(error);
        })
}
</script>
<template>
  <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
    <div class="grid grid-cols-8 gap-3">
      <div class="col-span-3 bg-gray-100 shadow rounded-lg p-3">
          <div class="w-full">
              <label class="text-gray-900 w-full text-xl">ETH to Stake</label>
              <input
                      type="text"
                      class="bg-gray-50 w-full px-4 py-3 mt-2 rounded-lg placeholder-gray-400 text-gray-900"
                      v-model="ethAmount"
                      placeholder="Enter amount of ETH to stake">
          </div>
          <div class="text-xs py-4">
              <p>
                  ETH will be locked in the contract and will be used to provide liquidity to the mortgage pool.
              </p>
              <p class="py-2">
                  Every time a new mortgage is created, a portion of the ETH will be used to pay the interest.
              </p>
              <p>
                  When interest is paid, a portion of your ETH will be available for withdrawal.
              </p>
          </div>
          <div class="text-center w-full">
              <button v-on:click="provideLiquidity" class="px-2 py-2 border-2 border-yellow-500 text-yellow-500 rounded-lg">
                  Stake
              </button>
          </div>
      </div>
      <div class="col-span-5 bg-gray-100 shadow rounded-lg">


          {{contractBalance}}ETH in pool
<br>
          Provided liquidity and your share of the pool.

        <p>Chart data</p>
      </div>
    </div>
  </div>
</template>
