<script setup lang="ts">
import {ref} from "vue";
import {useSubscriptionStore} from "@/stores/subscription.store";
const store = useSubscriptionStore();

enum subscribeType {
    Launch = 'Launch',
    Newsletter = 'Newsletter'
}

const props = defineProps({
    subType: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: false,
        default: 'Notify me'
    }
})

const email = ref('');
const success = ref(false);
const error = ref({
    status: false,
    msg: ''
});

async function subscribe() {
    const sType = props.subType as subscribeType;

    const dto = {
        email: email.value,
        type: sType
    }

    await store.subscribe(dto).then((result: any) => {
        success.value = true;
        error.value = {
            status: false,
            msg: ''
        }
    }).catch((e: any) => {
        success.value = false;

        error.value = {
            status: true,
            msg: e.response.data.message
        }
    });
}

function closeNotification() {
    email.value = '';
    success.value = false;
    error.value = {
        status: false,
        msg: ''
    }
}
</script>
<template>
    <div class="block">
        <div class="flex w-full">
            <label for="email-address" class="sr-only">Email address</label>
            <input type="email" v-model="email" id="email-address" autocomplete="email" class="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-56 sm:text-sm sm:leading-6" placeholder="Enter your email" />
            <div class="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button v-if="email === ''"  class="flex-none rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    {{buttonText}}
                </button>
                <button v-if="email !== ''" v-on:click="subscribe" class="flex-none rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    {{buttonText}}
                </button>
            </div>
        </div>
    </div>
    <div class="block mt-2">
        <div v-if="success" class="bg-green-100 max-w-md text-green-500 rounded px-2 py-1">
            <div class="flex">
                <div class="flex-1">
                    <p class="text-sm font-semibold leading-6">Thank you for subscribing!</p>
                </div>
                <div v-on:click="closeNotification" class="hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
        <div v-if="error.status" class="bg-red-100 max-w-md text-red-500 rounded px-2 py-1">
            <div class="flex">
                <div class="flex-1">
                    <p class="text-sm font-semibold leading-6">{{error.msg}}</p>
                </div>
                <div v-on:click="closeNotification" class="hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
