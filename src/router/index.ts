import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateProperty from '../views/properties/form.property.vue'
import PropertyDetail from '../views/properties/show.property.vue'
import MortgageLiquidityProvider from '../views/mortgage/liquidity.provider.mortgage.vue'
import MortgagePropertyRequest from '../views/mortgage/request.property.mortgage.vue'

import DaoMortgageDetail from '../views/dao/mortgage.detail.vue'

import TokenPresale from '../views/presale/presale.token.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/presale/token',
      name: 'presale.token',
      component: TokenPresale
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
    },
    {
      path: '/mortgage/request/:address',
      name: 'mortgage.property.request',
      component: MortgagePropertyRequest
    },
    {
      path: '/dao/mortgage/:address',
      name: 'dao.mortgage.detail',
      component: DaoMortgageDetail
    }
  ]
})

export default router
