import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateProperty from '../views/properties/form.property.vue'
import PropertyDetail from '../views/properties/show.property.vue'
import MortgageLiquidityProvider from '../views/mortgage/liquidity.provider.mortgage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/properties/create',
      name: 'property.create',
      component: CreateProperty
    },
    {
      path: '/property/:address',
      name: 'property.detail',
      component: PropertyDetail
    },
    {
      path: '/mortgage/provider',
      name: 'mortgage.liquidity.provider',
      component: MortgageLiquidityProvider
    }
  ]
})

export default router
