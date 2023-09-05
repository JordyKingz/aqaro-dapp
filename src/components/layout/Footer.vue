<script setup>
import { defineComponent, h } from 'vue'


</script>
<template>
  <footer class="">
    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
      <div class="flex justify-center space-x-6 md:order-2">
        <div>
          <a href="https://twitter.com/aqaroOfficial" target="_blank">
            <img src="@/assets/icons/twitter.svg" alt="twitter" class="h-5 w-5" />
          </a>
        </div>
        <div class="px-4">
          <a href="https://github.com/aqaro-decentralized-real-estate" target="_blank">
            <img src="@/assets/icons/github.svg" alt="github" class="h-5 w-5" />
          </a>
        </div>
        <div>
          <a href="https://discord.com/invite/XgbZ4Vggth" target="_blank">
            <img src="@/assets/icons/discord.svg" alt="discord" class="h-5 w-5" />
          </a>
        </div>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5 text-gray-500">&copy; {{ new Date().getFullYear() }} Aqaro, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

