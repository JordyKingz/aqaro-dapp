import { defineStore } from 'pinia'

export const propertyStore = defineStore('properties', {
    state: () => ({
        properties: <any>[],
    }),
    actions: {
        addProperty(property: any) {
            this.properties.push(property);
        },
    },
    getters: {
        getProperties: (state) => state.properties,
    },
})
