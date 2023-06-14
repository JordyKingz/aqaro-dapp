<script setup lang="ts">

import {onBeforeMount, ref, watch} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import Property from "@/chain/Property";
import Hero from "@/components/Hero.vue";
import LaunchNotify from "@/components/LaunchNotify.vue";
import EarnAPY from "@/components/EarnAPY.vue";
import {formatDollars, getEthPrice} from "@/utils/helpers";

const store = walletConnectionStore();

type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

type PropertyType = {
    id: string,
    askingPrice: string,
    price: string,
    addr: Address,
    seller: string,
    address: string
}


const propertyContracts = ref([]);
const properties = ref<PropertyType[]>([]);
const ETH_PRICE = ref(0);

onBeforeMount(async() => {
  ETH_PRICE.value = await getEthPrice();
  if (store.isConnected) {
    await fetchData();
  }
});

async function fetchData() {
    properties.value = [];
    propertyContracts.value = [];
    await getAllPropertyContracts();
    if (propertyContracts.value.length > 0) {
        await getPropertyContracts();
    }
}

async function getAllPropertyContracts() {
  const contract = new PropertyFactory(store.getChainId);

  await contract.getAllPropertyContracts()
      .then(async (result: any) => {
        propertyContracts.value = result;
      })
      .catch((error: any) => {
        console.log(error);
      });
}

async function getPropertyContracts() {
    for (let i = 0; i < propertyContracts.value.length; i++) {
        await getPropertyByAddress(propertyContracts.value[i]);
    }
}

async function getPropertyByAddress(address: string) {
  const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: any) => {
            console.log(result);
            const property = {
                address: address,
                id: result.id.toString(),
                askingPrice: result.askingPrice.toString(),
                price: `${Number(result.price.toString()) / 1e6}`,
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                },
                seller: result.seller,
            }
            // @ts-ignore
            properties.value.push(property);
        })
        .catch((error: any) => {
            console.log(error);
        });
}

watch(store, async () => {
  if (store.isConnected) {
    await fetchData();
  } else {
    properties.value = [];
    propertyContracts.value = [];
  }
});
</script>

<template>
    <Hero />
    <div v-if="properties.length > 0" class="bg-gray-800">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div class="flex items-center justify-between space-x-4">
                <h2 class="text-lg font-medium text-white">Recent Listings</h2>
                <a href="#" class="whitespace-nowrap text-sm font-medium text-indigo-500 hover:text-indigo-600">
                    View all
                    <span aria-hidden="true"> &rarr;</span>
                </a>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                <div v-for="property in properties" :key="property.id" class="group relative bg-gray-900 rounded-2xl">
                    <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" :alt="property.addr.street"  />
                        <div class="flex items-end p-4" aria-hidden="true">
                            <div class="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                                View Product
                            </div>
                        </div>
                    </div>
                    <div class="p-5 block">
                        <div class="flex items-center justify-between space-x-3 text-base font-medium text-gray-500">
                            <h3>
                                <RouterLink :to="{name: 'property.detail', params: {address: property.address}}">
                                    <span aria-hidden="true" class="absolute inset-0" />
                                    <h2 class="text-2xl font-bold text-white">Poelestraat</h2>
                                    <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                                </RouterLink>
                            </h3>
                            <p class="text-xs font-bold text-indigo-500">{{ Number(property.price / ETH_PRICE).toFixed(6) }}ETH</p>
                        </div>
<!--                        <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>-->
                        <p class="mt-1 text-sm text-gray-500">{{formatDollars(property.price)}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EarnAPY />
    <LaunchNotify />
</template>
