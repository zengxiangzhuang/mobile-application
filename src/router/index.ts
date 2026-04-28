import { createRouter, createWebHistory } from 'vue-router'

// 路由规则数组
const routes = [
  {
    path: '/',
    name: 'Entry',
    component: () => import('@/pages/EntryPage.vue'), // 首页/入口页
    meta: { title: '首页' }, // 可选：页面标题，方便全局设置
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/pages/MinePage.vue'), // 我的页面
    meta: { title: '个人中心' },
  },
  // 404页面（可选，建议加）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 等价于 routes: routes
})

export default router
