<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Feed from "@/components/pages/dao/dashboard/Feed.vue";

const route = useRoute();
const store = walletConnectionStore();
</script>
<template>
    <main class="lg:pl-72">
        <div class="xl:pr-96">
            <div class="px-4 text-white py-10 sm:px-6 lg:px-8 lg:py-6">
                <div class="flex">
                    <div class="flex-1">
                        Overview Proposals
                    </div>
                    <div class="flex">
                        <RouterLink :to="{name: 'dao.proposal.create'}" class="border-2 border-indigo-500 px-2 py-2 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-gray-900">
                            Create Proposal
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </main>

</template>