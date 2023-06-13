<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import PropertyFactory from "@/chain/PropertyFactory";
import {walletConnectionStore} from "@/stores/wallet.store";
import {propertyStore} from "@/stores/property.store";
import CoingeckoApi from "@/lib/api/coingecko.api";
import {formatDollars} from "../../utils/helpers";
import DragDrop from "@/components/form/DragDrop.vue";

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
type Seller = {
    wallet: string,
    name: string,
    email: string,
    status: number
}
type Property = {
  addr: Address,
  seller: Seller,
  description: string,
  askingPrice: string,
  price: string,
}

const store = walletConnectionStore();
const propertiesStore = propertyStore();

const lastName = ref('');
let property = ref<Property>(
  {
    addr: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: ""
    },
    description: "",
    askingPrice: "",
    price: "",
    seller: {
      wallet: "",
      name: "",
      email: "",
      status: 0
    }
  }
);

let selectedFiles = ref([]);
let fileArray = ref([]);

const ETH_PRICE = ref(0);
const CURRENCY = ref('usd');

onBeforeMount(async () => {
    await getEthPrice();
});

async function getEthPrice() {
    const api = new CoingeckoApi();
    await api.getTokenPrice('ethereum', CURRENCY.value)
        .then((result: any) => {
            ETH_PRICE.value = result.data.ethereum.usd;
        });

    await api.getCoins('ethereum')
        .then((result: any) => {
            console.log(result);
        });
}

async function listPropertyService() {
    const dto = {
        property: property.value,
        files: fileArray.value,
        name: `${property.value.seller.name}`,
        last_name: lastName.value,
        email: property.value.seller.email,
    }
}

async function listPropertyChain() {
  const contract = new PropertyFactory(store.getChainId);
  property.value.seller.wallet = store.connectedWallet;
  const priceInDollars = Number(property.value.askingPrice) * ETH_PRICE.value; // hard coded for now
  property.value.price = priceInDollars.toString();
  property.value.seller.name = `${property.value.seller.name} ${lastName.value}`;

  await contract.listProperty(property.value)
      .then(async (result: any) => {
          await result.wait(1);
          console.log(result);
      });
}

function uploadFiles(files: any) {
    for(let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            // @ts-ignore
            fileArray.value.push({
                // @ts-ignore
                name: file.name,
                // @ts-ignore
                type: file.type,
                // @ts-ignore
                size: file.size,
                // @ts-ignore
                data: fileReader.result
            });
        }
        // @ts-ignore
        selectedFiles.value.push(files[i]);
    }
}

function clearFiles() {
    selectedFiles.value = [];
    fileArray.value = [];
}


</script>
<template>
    <div v-if="store.isConnected" class="mx-auto max-w-7xl px-8 py-12">
        <div class="space-y-12">
            <div class="border-b border-white/10 pb-12 text-gray-300">
<!--                {{propertiesStore.properties}}-->
                <h2 class="text-base font-semibold leading-7 text-white">Property Information</h2>
                <p class="mt-1 text-sm leading-6 text-gray-400">This information will be displayed publicly so be careful what you share.</p>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-4">
                        <label for="username" class="block text-sm font-medium leading-6 text-white">
                            Asking Price
                            <span class="pl-2">{{property.askingPrice}}ETH</span>
                            <span class="pl-2">|</span>
                            <span class="pl-2">{{formatDollars(`${Number(property.askingPrice) * ETH_PRICE}`)}}</span>
                        </label>
                        <div class="mt-2">
                            <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                <input type="text" v-model="property.askingPrice" class="flex-1 border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" placeholder="Price in ETH" />
                            </div>
                        </div>
                    </div>
                    <div class="col-span-full">
                        <label for="street-address" class="block text-sm font-medium leading-6 text-white">Street address</label>
                        <div class="mt-2">
                            <input type="text" v-model="property.addr.street" autocomplete="street-address" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div class="sm:col-span-2 sm:col-start-1">
                        <label for="city" class="block text-sm font-medium leading-6 text-white">City</label>
                        <div class="mt-2">
                            <input type="text" v-model="property.addr.city" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div class="sm:col-span-2">
                        <label for="region" class="block text-sm font-medium leading-6 text-white">State / Province</label>
                        <div class="mt-2">
                            <input type="text" v-model="property.addr.state" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div class="sm:col-span-2">
                        <label for="postal-code" class="block text-sm font-medium leading-6 text-white">ZIP / Postal code</label>
                        <div class="mt-2">
                            <input type="text" v-model="property.addr.zip" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="sm:col-span-3">
                        <label for="country" class="block text-sm font-medium leading-6 text-white">Country</label>
                        <div class="mt-2">
                            <select v-model="property.addr.country" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                <option selected value="us">United States</option>
                                <option value="nl">Netherlands</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-span-full">
                        <label for="about" class="block text-sm font-medium leading-6 text-white">Property Description</label>
                        <div class="mt-2">
                            <textarea v-model="property.description" rows="3" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                        <p class="mt-3 text-sm leading-6 text-gray-400">Write a few sentences about the property you sell.</p>
                    </div>

                    <DragDrop
                      class="col-span-full"
                      :fileArray="fileArray"
                      @upload:clear="clearFiles"
                      @upload:drop="uploadFiles"
                    />

<!--                    <div class="col-span-full">-->
<!--                        <label for="cover-photo" class="block text-sm font-medium leading-6 text-white">Property Photos</label>-->
<!--                        <div class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">-->
<!--                            <div class="text-center">-->
<!--                                <PhotoIcon class="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />-->
<!--                                <div class="mt-4 flex text-sm leading-6 text-gray-400">-->
<!--                                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">-->
<!--                                        <span>Upload a file</span>-->
<!--                                        <input id="file-upload" name="file-upload" type="file" class="sr-only" />-->
<!--                                    </label>-->
<!--                                    <p class="pl-1">or drag and drop</p>-->
<!--                                </div>-->
<!--                                <p class="text-xs leading-5 text-gray-400">PNG, JPG up to 10MB</p>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </div>

            <div class="border-b border-white/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-white">Personal Information</h2>
                <p class="mt-1 text-sm leading-6 text-gray-400">Use a permanent address where you can receive mail.</p>
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                        <label for="first-name" class="block text-sm font-medium leading-6 text-white">First name</label>
                        <div class="mt-2">
                            <input type="text" v-model="property.seller.name" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="sm:col-span-3">
                        <label for="last-name" class="block text-sm font-medium leading-6 text-white">Last name</label>
                        <div class="mt-2">
                            <input type="text" v-model="lastName" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="sm:col-span-4">
                        <label for="email" class="block text-sm font-medium leading-6 text-white">Email address</label>
                        <div class="mt-2">
                            <input type="email" v-model="property.seller.email" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button class="text-sm font-semibold leading-6 text-white">Cancel</button>
            <button v-on:click="listPropertyService" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
        </div>
    </div>
</template>