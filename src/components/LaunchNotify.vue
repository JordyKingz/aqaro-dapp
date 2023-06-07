<script setup lang="ts">
</script>
<template>
    <div class="bg-gray-800 py-16 sm:py-24">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
                <h2 class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Get notified when we’re launching.</h2>
                <p class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                    Be the first to experience the future of housing - sign up for our launch notifications and get ready to join the decentralized housing revolution.
                </p>
                <form class="mx-auto mt-10 flex max-w-md gap-x-4">
                    <label for="email-address" class="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autocomplete="email" class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6" placeholder="Enter your email" />
                    <button type="submit" class="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Notify me</button>
                </form>

            </div>
        </div>
    </div>
</template>
