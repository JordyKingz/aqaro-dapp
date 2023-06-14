<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";
import {ethers} from "ethers";
import Show from "@/components/property/show.vue";
import {propertyStore} from "@/stores/property.store";

const store = walletConnectionStore();
const propStore = propertyStore();
const route = useRoute();

type Seller = {
    wallet: string,
    name: string,
    email: string,
    status: number
}
type Property = {
  addr: Address,
  askingPrice: string,
  price: string,
  id: string,
  service_id: string,
  seller: Seller,
    description: string,
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
const propFiles = ref([]);
const highestBid = ref('0');
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

onBeforeMount(async () => {
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getPropertyChain(`${route.params.address}`);
        await getPropertyService(property.value.service_id);
        await getBidOpen(`${route.params.address}`);

        await getHighestBid(`${route.params.address}`);
    }
});

async function getPropertyChain(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: Property) => {
            property.value = {
                id: result.id.toString(),
                service_id: result.service_id.toString(),
                askingPrice: result.askingPrice.toString(),
                price: `${Number(result.price.toString()) / 1e6}`,
                description: result.description,
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                },
                seller: {
                    wallet: result.seller.wallet,
                    name: result.seller.name,
                    email: result.seller.email,
                    status: result.seller.status
                },
                created: result.created.toString()
            }
            // property.value = result;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getPropertyService(id: string) {
    await propStore.getProperty(id)
        .then(response => {
            console.log(response.data)
            propFiles.value = response.data.files;
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
    :files="propFiles"
    :contractOpenDate="contractOpenDate"
    :propertyContractAddress="propertyContractAddress"
    :bidOpen="bidOpen"
  />
</template>
