<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const store = walletConnectionStore();
</script>
<template>
    <div v-if="store.isConnected" class="mx-auto max-w-7xl px-8 py-12 text-blue-500">
        Overview Mortgage
    </div>
</template>