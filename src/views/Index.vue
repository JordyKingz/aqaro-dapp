<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
</script>

<template>
  <Header />
  <div class="relative">
    <RouterView />
  </div>
  <Footer />

</template>

