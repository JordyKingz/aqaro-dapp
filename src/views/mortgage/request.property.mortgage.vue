<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import MortgagePool from "@/chain/MortgagePool";
import {ethers} from "ethers";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";

const store = walletConnectionStore();
const route = useRoute();

const property = ref('');
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');


const extraMortgageAmount = ref('');
const ownMoney = ref('');

const mortgageRequest = ref({
    income: '',
    interestRate: '',

})

onBeforeMount(async () => {
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getProperty(`${route.params.address}`);
        await getBidOpen(`${route.params.address}`);
    }
});

async function getProperty(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: any) => {
            property.value = result;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getBidOpen(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.biddingOpenTime()
        .then(async (result: any) => {
            const currentDate = new Date().getTime();
            const contractOpenTime = new Date(result.toString() * 1000).getTime();
            contractOpenDate.value = new Date(result.toString() * 1000);

            bidOpen.value = currentDate >= contractOpenTime;
        })
        .catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
  <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
      <div class="bg-gray-100 shadow rounded-md p-4">
          <div>
              <h2 class="text-base font-semibold leading-7 text-gray-800">Personal Information</h2>
              <p class="text-xs">
                  Please provide your personal information to be considered for a mortgage.
                  KYC data is stored privately, only needed information is shared with the lender.
                  <br>
                  {{ property.askingPrice.toString() }}ETH
              </p>
              <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Property Asking Price</label>
                      <div class="mt-2">
                          <input type="text" disabled :value="`${property.askingPrice.toString()} ETH`" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Extra funds needed (max 15% of asking price)</label>
                      <p class="text-xs">
                          {{(Number(property.askingPrice.toString()) * 0.15)}}ETH
                      </p>
                      <div class="mt-2">
                          <input type="number" :max="(Number(property.askingPrice.toString()) * 0.15)" v-model="extraMortgageAmount" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Own Money, in ETH</label>
                      <div class="mt-2">
                          <input type="text" v-model="ownMoney" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Mortgage Needed</label>
                      <div class="mt-2">
                          <input type="text" disabled :value="(Number(property.askingPrice.toString()) + Number(extraMortgageAmount)) - Number(ownMoney)" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Income</label>
                      <div class="mt-2">
                          <input type="text" v-model="mortgageRequest.income" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full bg-gray-200">
                    Based on the information you provided we can offer you a mortgage of
                    
                  </div>
              </div>
              <div class="mt-8 block">
                  <button class="border-2 border-yellow-500 text-yellow-500 rounded-md px-2 py-3">Request Mortgage</button>
              </div>
          </div>
      </div>
  </div>
</template>
