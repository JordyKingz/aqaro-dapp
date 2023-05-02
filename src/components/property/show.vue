<script setup lang="ts">
import {PropType, ref} from 'vue';
import { StarIcon } from '@heroicons/vue/20/solid';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

type Property = {
    addr: Address,
    askingPrice: string,
    id: string,
    seller: string,
    created: string
}
type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

defineProps({
    property: {
        type: Object as PropType<Property>,
        required: true,
    },
    contractOpenDate: {
        type: Date,
        required: true
    },
    propertyContractAddress: {
        type: String,
        required: true
    },
    bidOpen: {
        type: Boolean,
        required: true
    },
})
const product = {
    name: 'Basic Tee 6-Pack',
    price: '$192',
    href: '#',
    breadcrumbs: [
        { id: 1, name: 'Men', href: '#' },
        { id: 2, name: 'Clothing', href: '#' },
    ],
    images: [
        {
            src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            alt: 'Two each of gray, white, and black shirts laying flat.',
        },
        {
            src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            alt: 'Model wearing plain black basic tee.',
        },
        {
            src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            alt: 'Model wearing plain gray basic tee.',
        },
        {
            src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            alt: 'Model wearing plain white basic tee.',
        },
    ],
    highlights: [
        'Spacious 3-bedroom apartment',
        'Over 100m² of luxurious living space',
        'Bright and airy open plan living area',
        'Fully equipped kitchen with high-quality finishes and fittings',
        'Private balcony with peaceful garden view',
    ],
    details:
        'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}

function propertyInDollars(priceInEth: string) {
    const priceInDollars = parseFloat(priceInEth) * 1850;

    let formatter;
    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    return formatter.format(Number(priceInDollars));
}
</script>
<template>
    <div class="bg-gray-900">
        <div class="pt-6">
            <!-- Image gallery -->
            <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                <div class="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                    <img :src="product.images[0].src" :alt="product.images[0].alt" class="h-full w-full object-cover object-center" />
                </div>
                <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                    <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                        <img :src="product.images[1].src" :alt="product.images[1].alt" class="h-full w-full object-cover object-center" />
                    </div>
                    <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                        <img :src="product.images[2].src" :alt="product.images[2].alt" class="h-full w-full object-cover object-center" />
                    </div>
                </div>
                <div class="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                    <img :src="product.images[3].src" :alt="product.images[3].alt" class="h-full w-full object-cover object-center" />
                </div>
            </div>

            <!-- Product info -->
            <div class="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <h1 class="text-2xl font-bold tracking-tight text-gray-200 sm:text-3xl">{{ property.addr.street }}</h1>
                    <h2 class="text-xl font-bold tracking-tight text-gray-400">{{ property.addr.zip }} {{ property.addr.city }}</h2>

                    <code class="text-xs block mt-8 text-gray-400">
                        {{ property }}
                    </code>
                </div>

                <div class="mt-8 lg:row-span-3">
                    <h2 class="sr-only">Property information</h2>
                    <p class="text-2xl tracking-tight text-white">{{ propertyInDollars(property.askingPrice) }}</p>
                    <p class="text-xl tracking-tight text-white">{{ property.askingPrice }}ETH</p>

                    <p class="text-gray-400 mt-8">
                        Sale start date: <br>
                        {{contractOpenDate}}
                    </p>


                    <button v-if="bidOpen" class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Make Offer
                    </button>
                    <RouterLink :to="{name: 'mortgage.property.request', params: {address: propertyContractAddress}}" class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Request mortgage
                    </RouterLink>
                </div>

                <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                    <div>
                        <div class="space-y-6">
                            <p class="text-base text-gray-400">
                                Welcome to your new home!
                                This stunning 3-bedroom apartment offers over 100m² of luxurious living space in the heart of downtown.
                                The bright and airy open plan living area is perfect for relaxing or entertaining guests, while the fully equipped kitchen features high-quality finishes and fittings.
                                Step outside onto your private balcony and enjoy the peaceful view of the beautifully landscaped garden.
                                With three spacious bedrooms, this apartment is perfect for families or professionals seeking a comfortable and convenient living experience.
                                Don't miss your chance to own this exceptional property - schedule a viewing today and make it yours!</p>
                        </div>
                    </div>

                    <div class="mt-10">
                        <h3 class="text-sm font-medium text-indigo-500">Highlights</h3>

                        <div class="mt-4">
                            <ul role="list" class="list-disc space-y-2 pl-4 text-sm">
                                <li v-for="highlight in product.highlights" :key="highlight" class="text-gray-400">
                                    <span class="text-gray-400">{{ highlight }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="mt-10">
                        <h2 class="text-sm font-medium text-indigo-500">Details</h2>

                        <div class="mt-4 space-y-6">
                            <p class="text-sm text-gray-400">
                                Located in the heart of downtown, this apartment offers easy access to a wide range of local amenities.
                                Take a stroll to the nearby park and enjoy a picnic on a sunny day, or explore the bustling local market with its fresh produce and artisanal goods.
                                For your daily needs, there are several grocery stores and convenience stores within walking distance, while a wide range of cafes, restaurants, and bars offer plenty of options for dining and entertainment.
                                With excellent public transportation links nearby, you're just a short ride away from all that the city has to offer.
                                Come see for yourself and discover the convenience and charm of this vibrant neighborhood.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>