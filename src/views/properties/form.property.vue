<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import PropertyFactory from "@/chain/PropertyFactory";
import {walletConnectionStore} from "@/stores/wallet.store";
import {propertyStore} from "@/stores/property.store";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
type Property = {
  addr: Address,
  askingPrice: number,
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
      .then((result: any) => {
        console.log(result);
      });
}


</script>
<template>
  <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
      {{propertiesStore.properties}}
    <div class="bg-gray-100 shadow rounded-md p-4">
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-800">Property Information</h2>

        <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
          <div class="col-span-full">
            <label for="street-address" class="block text-sm font-medium leading-6 text-gray-800">Asking price</label>
            <div class="mt-2">
              <input type="number" v-model="property.askingPrice" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div class="col-span-full">
            <label for="street-address" class="block text-sm font-medium leading-6 text-gray-800">Street address</label>
            <div class="mt-2">
              <input type="text" v-model="property.addr.street" autocomplete="street-address" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div class="sm:col-span-2 sm:col-start-1">
            <label for="city" class="block text-sm font-medium leading-6 text-gray-800">City</label>
            <div class="mt-2">
              <input type="text" v-model="property.addr.city" autocomplete="address-level2" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="region" class="block text-sm font-medium leading-6 text-gray-800">State / Province</label>
            <div class="mt-2">
              <input type="text" v-model="property.addr.state" autocomplete="address-level1" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="postal-code" class="block text-sm font-medium leading-6 text-gray-800">ZIP / Postal code</label>
            <div class="mt-2">
              <input type="text" v-model="property.addr.zip" autocomplete="postal-code" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="block text-sm font-medium leading-6 text-gray-800">Country</label>
            <div class="mt-2">
              <select v-model="property.addr.country" autocomplete="country-name" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6">
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
</template>
