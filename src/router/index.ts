import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/early-investor',
      name: 'early.investor',
      component: () => import('../views/invest/early.investment.vue'),
    },
    // {
    //   path: '/presale',
    //   name: 'invest.presale',
    //   component: () => import('../views/invest/presale.token.vue'),
    // },
    {
      path: '/properties/create',
      name: 'property.create',
      component: () => import('../views/properties/form.property.vue'),
    },
    {
      path: '/property/:address',
      name: 'property.detail',
      component: () => import('../views/properties/show.property.vue'),
    },
    {
      path: '/mortgage/provider',
      name: 'mortgage.liquidity.provider',
      component: () => import('../views/mortgage/liquidity.provider.mortgage.vue'),
    },
    {
      path: '/mortgage/request/:address',
      name: 'mortgage.property.request',
      component: () => import('../views/mortgage/request.property.mortgage.vue'),
    },
    {
      path: '/dao/mortgage/:address',
      name: 'dao.mortgage.detail',
      component: () => import('../views/dao/mortgage.detail.vue'),
    }
  ]
})

export default router
