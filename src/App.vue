<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
</script>

<template>
  <div class="wrapper bg-gray-800 min-h-screen">
    <Header />
    <RouterView class="bg-gray-800" />
  </div>
</template>

