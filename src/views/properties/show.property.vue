<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";

const store = walletConnectionStore();
const route = useRoute();

const property = ref('');
onBeforeMount(async () => {
  await getProperty(`${route.params.address}`);
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
</script>
<template>
  <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
    <div class="block w-full h-96 object-cover">
      <img class="w-full max-h-96 object-cover" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" alt="property image">
    </div>
    <div class="grid grid-cols-8 gap-3 mt-4">
      <div class="col-span-6">
          <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ property.addr.street }}</h1>
              <h2 class="text-xl font-bold text-gray-900 mt-2">{{ property.addr.zip }} {{ property.addr.city }}</h2>

              <div class="mt-4">
                  <span>x m2</span> <span>x rooms</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900 mt-4">{{ property.askingPrice }}ETH</h1>
          </div>
          <div class="mt-6">
              <h1 class="text-3xl font-bold text-gray-900">Description</h1>
              <p class="mt-4">
                  {{ property }}
              </p>
              <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae distinctio error illo magni sit.
                  Aspernatur commodi dignissimos explicabo molestias numquam ratione repellendus sit totam!
                  A excepturi maiores optio perspiciatis repellat?
              </p>
              <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae distinctio error illo magni sit.
                  Aspernatur commodi dignissimos explicabo molestias numquam ratione repellendus sit totam!
                  A excepturi maiores optio perspiciatis repellat?
              </p>
          </div>
      </div>
      <div class="col-span-2 bg-gray-50">

      </div>
    </div>
  </div>
</template>
