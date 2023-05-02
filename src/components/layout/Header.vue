<script setup lang="ts">
import {ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import {connectMetaMask, formatAddress, setChainSettings} from "@/utils/helpers";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import {propertyStore} from "@/stores/property.store";
import {useRouter} from "vue-router";

const router = useRouter();
const store = walletConnectionStore();
const propertiesStore = propertyStore();

const mobileMenuOpen = ref(false);

let wallet = ref('');
let connected = ref(false);

async function connect() {
  await connectMetaMask();
  await setChainSettings();

  wallet.value = formatAddress(store.getConnectedWallet);

  if (wallet.value) {
    connected.value = true;

    await setListeners();
  }
}

async function setListeners() {
    const signer = new PropertyFactory(store.getChainId);
    const contract = await signer.getContract();

    await contract.on('PropertyCreated', (propertyAddress: string, owner: string, propertyId: any) => {
        if (owner.toString().toLowerCase() === store.getConnectedWallet.toString().toLowerCase()) {
            propertiesStore.addProperty(propertyAddress);
            router.push({name: 'property.detail', params: {address: propertyAddress}});
        }
    });
}
async function disconnect() {
  await store.disconnect();
  connected.value = false;
  wallet.value = '';
}
</script>
<template>
    <header class="bg-gray-900">
        <nav class="mx-auto flex max-w-7xl items-center justify-between h-28 p-6 lg:px-8" aria-label="Global">
            <div class="flex items-center gap-x-12">
                <RouterLink :to="{name: 'home'}" class="-m-1.5 p-1.5">
                    <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                </RouterLink>
                <div class="hidden lg:flex lg:gap-x-12">
                    <RouterLink :to="{name: 'home'}" class="text-sm font-semibold leading-6 text-white">Home</RouterLink>
                    <RouterLink :to="{name: 'presale.token'}" class="text-sm font-semibold leading-6 text-white">Presale</RouterLink>
                    <RouterLink v-if="store.isConnected" :to="{name: 'mortgage.liquidity.provider'}" class="text-sm font-semibold leading-6 text-white">Earn</RouterLink>
                    <RouterLink v-if="store.isConnected" :to="{name: 'property.create'}" class="text-sm font-semibold leading-6 text-white">List Property</RouterLink>
                </div>
            </div>
            <div class="flex lg:hidden">
                <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div class="hidden lg:flex">
                <span v-if="!connected" v-on:click="connect" class="text-sm font-semibold hover:cursor-pointer leading-6 text-white">Connect <span aria-hidden="true">&rarr;</span></span>
                <button v-if="connected" v-on:click="disconnect" class="text-white font-medium bg-indigo-500 py-3.5 px-3.5 rounded-3xl">
                    <span class="flex">
<!--                        <span class="bg-gray-800 w-8 h-8 rounded-3xl"></span>-->
                        <span>
                          {{ wallet }}
                        </span>
                    </span>
                </button>
            </div>
        </nav>
        <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
            <div class="fixed inset-0 z-10" />
            <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div class="flex items-center justify-between">
                    <a href="#" class="-m-1.5 p-1.5">
                        <span class="sr-only">Your Company</span>
                        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </a>
                    <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                        <span class="sr-only">Close menu</span>
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                            <RouterLink :to="{name: 'home'}" class="-mx-3 block rounded-md text-gray-700 hover:text-yellow-500 py-2.5 px-3 text-base font-semibold leading-7">Home</RouterLink>
                            <RouterLink :to="{name: 'presale.token'}" class="-mx-3 block rounded-md text-gray-700 hover:text-yellow-500 py-2.5 px-3 text-base font-semibold leading-7">Presale</RouterLink>
                            <RouterLink v-if="store.isConnected" :to="{name: 'mortgage.liquidity.provider'}" class="-mx-3 block rounded-md text-gray-700 hover:text-yellow-500 py-2.5 px-3 text-base font-semibold leading-7">Earn</RouterLink>
                            <RouterLink v-if="store.isConnected" :to="{name: 'property.create'}" class="-mx-3 block rounded-md border-2 border-gray-800 py-2.5 px-3 text-base font-semibold leading-7 text-gray-800">List Property</RouterLink>
                        </div>
                        <div class="py-6">
                            <span v-if="!connected" v-on:click="connect" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Connect</span>
                            <button v-if="connected" v-on:click="disconnect" class="block rounded-md bg-yellow-500 py-2.5 px-3 text-base font-semibold leading-7 text-white hover:bg-yellow-600">
                                {{ wallet }}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
</template>
