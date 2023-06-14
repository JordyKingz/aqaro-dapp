<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import Footer from "@/components/layout/Footer.vue";
import Banner from "@/components/layout/Banner.vue";
</script>

<template>
  <div class="wrapper min-h-screen bg-gray-900">
    <Banner />
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

