<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import PropertyFactory from "@/chain/PropertyFactory";
import {walletConnectionStore} from "@/stores/wallet.store";
import {propertyStore} from "@/stores/property.store";
import {ethers} from "ethers";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
type Property = {
  addr: Address,
  askingPrice: string,
}

const store = walletConnectionStore();

const propertiesStore = propertyStore();

let property = ref<Property>(
  {
    addr: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: ""
    },
    askingPrice: ""
  }
);

async function listProperty() {
  const contract = new PropertyFactory(store.getChainId);

  await contract.listProperty(property.value)
      .then(async (result: any) => {
          await result.wait(1);
        console.log(result);
      });
}


</script>
<template>
  <div class="bg-gray-900 py-16">
    <div v-if="store.isConnected" class="mx-auto max-w-7xl">
      {{propertiesStore.properties}}
      <div class="bg-gray-800 shadow rounded-md p-4">
        <div>
          <h2 class="text-base font-semibold leading-7 text-gray-500">Property Information</h2>
          <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
            <div class="col-span-full">
              <label for="street-address" class="block text-sm font-medium leading-6 text-gray-500">Asking price</label>
              <div class="mt-2">
                <input type="text" v-model="property.askingPrice" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div class="col-span-full">
              <label for="street-address" class="block text-sm font-medium leading-6 text-gray-500">Street address</label>
              <div class="mt-2">
                <input type="text" v-model="property.addr.street" autocomplete="street-address" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-2 sm:col-start-1">
              <label for="city" class="block text-sm font-medium leading-6 text-gray-500">City</label>
              <div class="mt-2">
                <input type="text" v-model="property.addr.city" autocomplete="address-level2" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="region" class="block text-sm font-medium leading-6 text-gray-500">State / Province</label>
              <div class="mt-2">
                <input type="text" v-model="property.addr.state" autocomplete="address-level1" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="postal-code" class="block text-sm font-medium leading-6 text-gray-500">ZIP / Postal code</label>
              <div class="mt-2">
                <input type="text" v-model="property.addr.zip" autocomplete="postal-code" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="country" class="block text-sm font-medium leading-6 text-gray-500">Country</label>
              <div class="mt-2">
                <select v-model="property.addr.country" autocomplete="country-name" class="block bg-gray-900 w-full rounded-md border-0 py-2.5 px-3 text-gray-500 shadow-sm ring-1 ring-inset ring-purple-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option selected value="nl">Netherlands</option>
                  <option value="us">United States</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mt-8 block">
            <button v-on:click="listProperty" class="border-2 border-yellow-500 text-yellow-500 rounded-md px-2 py-3">List Property</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
