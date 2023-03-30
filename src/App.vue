<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
</script>

<template>
  <div class="wrapper min-h-screen">
    <Header />
    <RouterView />
  </div>
</template>

