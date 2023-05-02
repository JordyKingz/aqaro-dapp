<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";
import {ethers} from "ethers";
import Show from "@/components/property/show.vue";

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
            console.log(result);
            property.value = {
                id: result.id.toString(),
                askingPrice: result.askingPrice.toString(),
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                },
                seller: result.seller,
                created: result.created.toString()
            }
            // property.value = result;
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
            // @ts-ignore
            contractOpenDate.value = new Date(result.toString() * 1000).toLocaleString();

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
  <Show v-if="store.isConnected"
    :property="property"
    :contractOpenDate="contractOpenDate"
    :propertyContractAddress="propertyContractAddress"
    :bidOpen="bidOpen"
  />
</template>
