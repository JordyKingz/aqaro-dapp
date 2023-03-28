<script setup lang="ts">

import {onBeforeMount, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import {propertyStore} from "@/stores/property.store";

const store = walletConnectionStore();
const propertiesStore = propertyStore();

const properties = ref([]);

onBeforeMount(async() => {
  if (store.isConnected) {
    await getPropertyCounter();
    // await getPropertiesForOwner(store.getConnectedWallet);
  }
});

async function getPropertyCounter() {
  const contract = new PropertyFactory(store.getChainId);
  await contract.getPropertyCounter()
      .then(async (result: any) => {
        await getProperties(Number(result.toString()));
      })
      .catch((error: any) => {
        console.log(error);
      });
}

async function getProperties(counter: number) {
  const contract = new PropertyFactory(store.getChainId);
  for (let i = 1; i <= counter; i++) {
    await contract.getPropertyInfoById(i)
        .then((result: any) => {
          const property = {
            id: i.toString(),
            askingPrice: result.askingPrice.toString(),
            owner: result.owner,
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
}

// async function getPropertiesForOwner(wallet: string) {
//   const contract = new PropertyFactory(store.getChainId);
//
//   await contract.getPropertiesForOwner(wallet)
//       .then((result: any) => {
//         ownerProperties.value = result;
//       })
//       .catch((error: any) => {
//         console.log(error);
//       });
// }
</script>

<template>
  <p class="text-gray-300">
<!--    {{propertiesStore.getProperties}}-->
  </p>
  <code class="text-gray-300 mt-4">
    {{ properties }}
  </code>
</template>
