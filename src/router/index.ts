import { createRouter, createWebHistory } from 'vue-router'

import DaoIndex from '../views/old/dao/index.vue'
import NotFoundComponent from '../views/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('../views/pages/LandingView.vue'),
        },
        {
          path: '/about',
          name: 'page.about',
          component: () => import('../views/pages/AboutView.vue'),
        },
      ]
    },
    // {
    //   path: '',
    //   name: 'home',
    //   component: () => import('../views/pages/LandingView.vue'),
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/old/AboutView.vue'),
    // },
    // {
    //   path: '/just-shipped',
    //   name: 'just.shipped',
    //   component: () => import('../views/old/JustShippedView.vue'),
    // },
    // {
    //   path: '/early-investor',
    //   name: 'early.investor',
    //   component: () => import('../views/old/invest/early.investment.vue'),
    // },
    // // {
    // //   path: '/presale',
    // //   name: 'invest.presale',
    // //   component: () => import('../views/invest/presale.token.vue'),
    // // },
    // {
    //   path: '/stake',
    //   name: 'stake',
    //   component: () => import('../views/old/invest/stake.token.vue'),
    // },
    // {
    //   path: '/properties/all',
    //   name: 'property.overview',
    //   component: () => import('../views/old/properties/overview.property.vue'),
    // },
    // {
    //   path: '/properties/create',
    //   name: 'property.create',
    //   component: () => import('../views/old/properties/form.property.vue'),
    // },
    // {
    //   path: '/property/:address',
    //   name: 'property.detail',
    //   component: () => import('../views/old/properties/show.property.vue'),
    // },
    // {
    //   path: '/mortgage/provider',
    //   name: 'mortgage.liquidity.provider',
    //   component: () => import('../views/old/mortgage/liquidity.provider.mortgage.vue'),
    // },
    // {
    //   path: '/mortgage/request/:address',
    //   name: 'mortgage.property.request',
    //   component: () => import('../views/old/mortgage/request.property.mortgage.vue'),
    // },
    // {
    //   path: '/dao',
    //   component: DaoIndex,
    //   meta: {
    //     isAuthenticated: true,
    //   },
    //   children: [
    //     {
    //       path: '/dao/dashboard',
    //       name: 'dao.dashboard',
    //       component: () => import('../views/old/dao/dashboard.vue'),
    //       meta: {
    //         isAuthenticated: true,
    //       },
    //     },
    //     {
    //       path: '/dao/mortgage',
    //       name: 'dao.mortgage',
    //       children: [
    //         {
    //           path: '',
    //           name: 'dao.mortgage.overview',
    //           component: () => import('../views/old/dao/mortgages/overview.mortgage.vue'),
    //         },
    //         {
    //           path: 'request/:address',
    //           name: 'dao.mortgage.request.detail',
    //           component: () => import('../views/old/dao/mortgages/show.mortgage.vue'),
    //         }
    //       ]
    //     },
    //     {
    //       path: '/dao/proposal',
    //       name: 'dao.proposal',
    //       children: [
    //         {
    //           path: '',
    //           name: 'dao.proposal.overview',
    //           component: () => import('../views/old/dao/proposals/overview.proposal.vue'),
    //         },
    //         {
    //           path: 'create',
    //           name: 'dao.proposal.create',
    //           component: () => import('../views/old/dao/proposals/form.proposal.vue'),
    //         },
    //         {
    //             path: ':id',
    //             name: 'dao.proposal.detail',
    //             component: () => import('../views/old/dao/proposals/show.proposal.vue'),
    //         }
    //       ]
    //     }
    //   ],
    // },
    {
      path: '/:catchAll(.*)',
      component: NotFoundComponent,
      name: 'NotFound'
    }
  ]
})

export default router
