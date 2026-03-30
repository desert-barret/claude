import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('../pages/Docs.vue')
  },
  {
    path: '/docs/:slug',
    name: 'command-detail',
    component: () => import('../pages/CommandDetail.vue')
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: () => import('../pages/Terminal.vue')
  },
  {
    path: '/quiz/:sectionId',
    name: 'quiz',
    component: () => import('../pages/Quiz.vue')
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../pages/Progress.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
