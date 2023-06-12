<script setup lang="ts">

import Subscribe from "@/components/form/Subscribe.vue";

enum subscribeType {
    Launch = 'Launch',
    Newsletter = 'Newsletter'
}

const navigation = {
    solutions: [
        // { name: 'Getting Started', href: '#' },
        // { name: 'Earn', href: '#' },
        // { name: 'DAO', href: '#' },
        // { name: 'Mortgages', href: '#' },
        // { name: 'AQRO Token', href: '#' },
        // { name: 'Rewards', href: '#' },
        // { name: 'Tokenomics', href: '#' },
    ],
    company: [
        // { name: 'About', href: '#' },
        // { name: 'Jobs', href: '#' },
        // { name: 'Contact', href: '#' },
    ],
    legal: [
        { name: 'Lightpaper', href: 'Lightpaper_Aqaro.pdf' },
        // { name: 'Terms', href: '#' },
    ],
    social: [
        {
            name: 'Twitter',
            href: 'https://twitter.com/developerjordy',
            icon: '',
        },
        {
            name: 'GitHub',
            href: 'https://github.com/JordyKingz/aqaro-smart-contracts',
            icon: ''
        },
    ],
}
</script>
<template>
    <footer class="bg-gray-800" aria-labelledby="footer-heading">
        <h2 id="footer-heading" class="sr-only">Footer</h2>
        <div class="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
            <div class="xl:grid xl:grid-cols-3 xl:gap-8">
                <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                <div class="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
                    <div class="md:grid md:grid-cols-3 md:gap-8">
                        <div>
<!--                            <h3 class="text-sm font-semibold leading-6 text-white">Aqaro</h3>-->
<!--                            <ul role="list" class="mt-6 space-y-4">-->
<!--                                <li v-for="item in navigation.solutions" :key="item.name">-->
<!--                                    <a :href="item.href" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}</a>-->
<!--                                </li>-->
<!--                            </ul>-->
                        </div>
                        <div>
<!--                            <h3 class="text-sm font-semibold leading-6 text-white">Company</h3>-->
<!--                            <ul role="list" class="mt-6 space-y-4">-->
<!--                                <li v-for="item in navigation.company" :key="item.name">-->
<!--                                    <a :href="item.href" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}</a>-->
<!--                                </li>-->
<!--                            </ul>-->
                        </div>
                        <div class="mt-10 md:mt-0">
                            <h3 class="text-sm font-semibold leading-6 text-white">Legal</h3>
                            <ul role="list" class="mt-6 space-y-4">
                                <li v-for="item in navigation.legal" :key="item.name">
                                    <a :href="item.href" target="_blank" class="text-sm leading-6 text-gray-300 hover:text-white">{{ item.name }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
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
            <div class="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
                <div class="flex space-x-6 md:order-2">
                    <a v-for="item in navigation.social" :key="item.name" target="_blank" :href="item.href" class="text-gray-500 hover:text-gray-400">
                        {{item.name}}
                    </a>
                </div>
                <p class="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">&copy; {{ new Date().getFullYear() }} Aqaro, Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>