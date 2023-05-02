<script setup lang="ts">

import {onBeforeMount, ref, watch} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import {propertyStore} from "@/stores/property.store";
import Property from "@/chain/Property";
import Hero from "@/components/Hero.vue";
import LaunchNotify from "@/components/LaunchNotify.vue";

const store = walletConnectionStore();
const propertiesStore = propertyStore();

const propertyContracts = ref([]);
const properties = ref([]);
const ownerProperties = ref([]);

onBeforeMount(async() => {
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
        await getPropertyByAddress(propertyContracts.value[i])
    }
}

async function getPropertyByAddress(address: string) {
  const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: any) => {
            const property = {
                address: address,
                id: result.id.toString(),
                askingPrice: result.askingPrice.toString(),
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                }
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
    <div  v-if="properties.length > 0" class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div class="flex items-center justify-between space-x-4">
                <h2 class="text-lg font-medium text-gray-900">Recent Listings</h2>
                <a href="#" class="whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                    <span aria-hidden="true"> &rarr;</span>
                </a>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                <div v-for="property in properties" :key="property.id" class="group relative">
                    <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" :alt="property.addr.street"  />
                        <div class="flex items-end p-4" aria-hidden="true">
                            <div class="w-full rounded-md bg-indigo-500 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                                View Product
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                        <h3>
                            <RouterLink :to="{name: 'property.detail', params: {address: property.address}}">
                                <span aria-hidden="true" class="absolute inset-0" />
                                <h2 class="text-2xl font-bold text-gray-800">Poelestraat</h2>
                                <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                            </RouterLink>
                        </h3>
                        <p class="text-lg font-bold text-gray-800">{{ property.askingPrice }}ETH</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>
                </div>
                <div v-for="property in properties" :key="property.id" class="group relative">
                    <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" :alt="property.addr.street"  />
                        <div class="flex items-end p-4" aria-hidden="true">
                            <div class="w-full rounded-md bg-indigo-500 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                                View Product
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                        <h3>
                            <RouterLink :to="{name: 'property.detail', params: {address: property.address}}">
                                <span aria-hidden="true" class="absolute inset-0" />
                                <h2 class="text-2xl font-bold text-gray-800">Poelestraat</h2>
                                <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                            </RouterLink>
                        </h3>
                        <p class="text-lg font-bold text-gray-800">{{ property.askingPrice }}ETH</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>
                </div>
                <div v-for="property in properties" :key="property.id" class="group relative">
                    <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" :alt="property.addr.street"  />
                        <div class="flex items-end p-4" aria-hidden="true">
                            <div class="w-full rounded-md bg-indigo-500 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                                View Product
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                        <h3>
                            <RouterLink :to="{name: 'property.detail', params: {address: property.address}}">
                                <span aria-hidden="true" class="absolute inset-0" />
                                <h2 class="text-2xl font-bold text-gray-800">Poelestraat</h2>
                                <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                            </RouterLink>
                        </h3>
                        <p class="text-lg font-bold text-gray-800">{{ property.askingPrice }}ETH</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>
                </div>
                <div v-for="property in properties" :key="property.id" class="group relative">
                    <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" :alt="property.addr.street"  />
                        <div class="flex items-end p-4" aria-hidden="true">
                            <div class="w-full rounded-md bg-indigo-500 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                                View Product
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                        <h3>
                            <RouterLink :to="{name: 'property.detail', params: {address: property.address}}">
                                <span aria-hidden="true" class="absolute inset-0" />
                                <h2 class="text-2xl font-bold text-gray-800">{{property.addr.street}}</h2>
                                <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                            </RouterLink>
                        </h3>
                        <p class="text-lg font-bold text-gray-800">{{ property.askingPrice }}ETH</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-white">
        <div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div class="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                <svg viewBox="0 0 1024 1024" class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
                    <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fill-opacity="0.7" />
                    <defs>
                        <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                            <stop stop-color="#7775D6" />
                            <stop offset="1" stop-color="#E935C1" />
                        </radialGradient>
                    </defs>
                </svg>
                <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                    <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Earn up to 20% APY</h2>
                    <p class="mt-6 text-lg leading-8 text-gray-300">
                        Be a part of the Aqaro revolution and earn ETH and Aqaro tokens by providing ETH liquidity.
                        Join our decentralized housing market today and help us grow while benefiting from a secure and transparent investment opportunity.
                        Don't miss out - become a liquidity provider now!
                    </p>
                    <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                        <a href="#" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</a>
                        <a href="#" class="text-sm font-semibold leading-6 text-white">Learn more <span aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div class="relative mt-16 h-80 lg:mt-8">
                    <img class="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png" alt="App screenshot" width="1824" height="1080" />
                </div>
            </div>
        </div>
    </div>
    <LaunchNotify />
</template>
