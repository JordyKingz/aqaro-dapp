<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import Logo from "@/components/logo/logo.vue";
import LandingHero from "@/components/hero/Landing.hero.vue";
import Circle from "@/components/layout/Circle.vue";
import Subscribe from "@/components/old/form/Subscribe.vue";


enum subscribeType {
  Launch = 'Launch',
  Newsletter = 'Newsletter'
}
</script>
<template>
  <LandingHero />
<!--  <Circle class="mb-20 z-10" />-->

  <div class="mx-auto relative z-20 max-w-7xl text-white pb-10 px-6 lg:px-8">
    <div>
      <div class="grid grid-cols-5 gap-4">
        <div class="col-span-5 lg:col-span-2">
          <h1 class="text-xl text-gray-200 uppercase">
            Aqaro Ecosystem <span aria-hidden="true">&rarr;</span>
          </h1>
          <h1 class="text-3xl mt-4 text-indigo-500">
            Decentralized Real Estate
          </h1>
          <p class="text-large mt-4 text-gray-400">
            Aqaro is the decentralized housing market that uses blockchain to create a transparent and secure platform for buyers, sellers, and investors.
            Join us and be a part of the future of housing.
          </p>
        </div>
      </div>
    </div>

    <div class="pb-20">
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-6 lg:col-span-4">
          <h1 class="text-xl text-gray-200 uppercase">
            Developers <span aria-hidden="true">&rarr;</span>
          </h1>
          <div class="flex mt-4 space-x-4">
            <div class="w-full">
              <a href="/Fantastic_Whitepaper_Aqaro.pdf" target="_blank">
                <div class="bg-gray-900 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-xl px-4 py-4">
                  <div class="flex">
                    <div class="flex-1">
                      <span class="text-lg">
                        Whitepaper
                      </span>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div class="w-full">
              <a href="https://github.com/aqaro-decentralized-real-estate" target="_blank">
                <div class="bg-gray-900 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-xl px-4 py-4 ">
                  <div class="flex">
                    <div class="flex-1">
                      <span class="text-lg">
                        Github
                      </span>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-6 lg:col-span-3">
          <h1 class="text-xl text-gray-200 uppercase">
            Protocol Governance <span aria-hidden="true">&rarr;</span>
          </h1>
          <h1 class="text-3xl mt-4 text-indigo-500">
            Governed by the community.
          </h1>
          <p class="text-large mt-4 text-gray-400">
            The Aqaro Protocol is managed by a global community of investors, developers, and users.
            The community is responsible for the governance of the protocol, including the allocation of funds, the development of new features, and the implementation of new policies.
          </p>
        </div>
<!--        <div class="col-span-6 lg:col-span-3">-->
<!--          <div>-->
<!--            <div class="bg-gray-900 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-xl px-4 py-4 ">-->
<!--              <div class="flex">-->
<!--                <div class="pr-4">-->
<!--                  <span class="text-lg">-->
<!--                    Governance Forum-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">-->
<!--                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />-->
<!--                  </svg>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div>-->
<!--                <p>-->
<!--                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="mt-6">-->
<!--            <div class="bg-gray-900 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-xl px-4 py-4 ">-->
<!--              <div class="flex">-->
<!--                <div class="pr-4">-->
<!--                  <span class="text-lg">-->
<!--                    DAO-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">-->
<!--                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />-->
<!--                  </svg>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div>-->
<!--                <p>-->
<!--                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="mt-6">-->
<!--            <div class="bg-gray-900 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-xl px-4 py-4 ">-->
<!--              <div class="flex">-->
<!--                <div class="pr-4">-->
<!--                  <span class="text-lg">-->
<!--                    Governance Portal-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">-->
<!--                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />-->
<!--                  </svg>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div>-->
<!--                <p>-->
<!--                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="mt-20 border-t border-white/10 pt-8 lg:flex lg:items-center lg:justify-between">
      <div>
        <h3 class="text-sm font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
        <p class="mt-2 text-sm leading-6 text-gray-300">The latest news, articles, and resources, sent to your inbox weekly.</p>
      </div>
      <div class="mt-6 sm:flex sm:max-w-md lg:mt-0">
        <div class="block">
          <Subscribe :subType="subscribeType.Newsletter" :buttonText="'Subscribe'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>