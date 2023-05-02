<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";
import {ethers} from "ethers";

const store = walletConnectionStore();
const route = useRoute();

type Property = {
  addr: Address,
  askingPrice: string,
  id: string,
  seller: string,
  created: string
}
type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

const property = ref({} as Property);
const highestBid = ref('0');
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

onBeforeMount(async () => {
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getProperty(`${route.params.address}`);
        await getBidOpen(`${route.params.address}`);

        await getHighestBid(`${route.params.address}`);
    }
});

async function getProperty(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: Property) => {
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

async function getHighestBid(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getHighestBid()
        .then(async (result: any) => {
            highestBid.value = ethers.utils.formatEther(result.toString());
        })
        .catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
  <div class="bg-gray-900 py-16">
    <div v-if="store.isConnected" class="mx-auto max-w-7xl">
      <div class="block w-full h-96 object-cover">
        <img class="w-full max-h-96 object-cover" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" alt="property image">
      </div>
      <div class="grid grid-cols-8 gap-3 mt-4">
        <div class="col-span-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Poelestraat</h1>
                <h2 class="text-xl font-bold text-gray-900 mt-2">{{ property.addr.zip }} {{ property.addr.city }}</h2>

                <div class="mt-4">
                    <span>x m2</span> <span>x rooms</span>
                </div>
                <h1 class="text-xl font-bold text-gray-900 mt-4">{{ property.askingPrice }}ETH</h1>
            </div>
            <div class="mt-6">
                <h1 class="text-3xl font-bold text-gray-900">Description</h1>
                <p class="mt-4">
  <!--                  {{ property }}-->
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
        <div class="col-span-2 bg-gray-800 p-3">
          <div v-if="bidOpen">
            <p v-if="Number(highestBid) === 0">
                No bids yet
            </p>
            <p v-else>
                {{ highestBid }}ETH
            </p>
            <div>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Bid
              </button>
            </div>
          </div>
          <div v-else>
            Biding will open on {{ contractOpenDate.toLocaleString() }}
          </div>
          <div class="mt-4">
            <RouterLink :to="{name: 'mortgage.property.request', params: {address: propertyContractAddress}}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Request mortgage
            </RouterLink>
          </div>
          <div class="mt-4">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Plan visit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
