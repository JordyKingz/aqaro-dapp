<script setup lang="ts">

import {onBeforeMount, ref, watch} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import {propertyStore} from "@/stores/property.store";
import Property from "@/chain/Property";

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
    <div v-if="properties.length > 0" class="mx-auto max-w-7xl">
        <div class="grid grid-cols-8 gap-3">
            <div class="col-span-2 bg-gray-50 shadow rounded-lg p-3">
                filters
            </div>
            <div class="col-span-6">
                <div class="grid grid-cols-1 gap-3">
                    <div v-for="property in properties" :key="property.id" class="bg-gray-100 shadow col-span-1 rounded-lg">
                        <RouterLink class="grid grid-cols-3 gap-3" :to="{name: 'property.detail', params: {address: property.address}}">
                            <div class="col-span-1">
                                <div class="block border-2 border-gray-200 rounded-lg h-40"></div>
                            </div>
                            <div class="col-span-2 py-3">
                                <h2 class="text-2xl font-bold text-gray-800">{{ property.addr.street }}</h2>
                                <p>{{ property.addr.zip }} {{ property.addr.city }}</p>
                                <div class="mt-4">
                                    <p class="text-lg font-bold text-gray-800">{{ property.askingPrice }}ETH</p>
                                    <p><span>m2</span> <span>x rooms</span></p>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
