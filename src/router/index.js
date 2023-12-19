// Composables
import { createRouter, createWebHistory } from 'vue-router'
import formsRoute from './Forms';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AppBar.vue'),
    children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue'),
        },
        ...formsRoute,
      ],

  },
  {
    path: '/sign-in',
    component: () => import('@/views/auth/LoginView.vue'),
    name: 'SignIn'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
