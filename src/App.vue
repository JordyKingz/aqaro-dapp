<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import Header from './components/layout/Header.vue'
import Footer from "@/components/layout/Footer.vue";
import Banner from "@/components/layout/Banner.vue";
import {onBeforeMount} from "vue";

const router = useRouter();

onBeforeMount(() => {
  console.log(router);
});
</script>

<template>
  <div class="wrapper min-h-screen">
    <Banner />
    <Header
            v-if="
            router.currentRoute.value.name !== 'dao.dashboard' &&
            router.currentRoute.value.name !== 'dao.mortgage.overview' &&
            router.currentRoute.value.name !== 'dao.mortgage.show' &&
            router.currentRoute.value.name !== 'dao.proposal' &&
            router.currentRoute.value.name !== 'dao.proposal.overview'"/>
    <RouterView />
    <Footer
            v-if="
            router.currentRoute.value.name !== 'dao.dashboard' &&
            router.currentRoute.value.name !== 'dao.mortgage.overview' &&
            router.currentRoute.value.name !== 'dao.mortgage.show' &&
            router.currentRoute.value.name !== 'dao.proposal' &&
            router.currentRoute.value.name !== 'dao.proposal.overview'"/>
    />
  </div>
</template>

