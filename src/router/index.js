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
        {
          path: 'change-password',
          name: 'changePassword',
          component: () => import('@/views/auth/ChangePasswordView.vue'),
        },
        ...formsRoute,
      ],

  },
  {
    path: '/sign-in',
    component: () => import('@/views/auth/LoginView.vue'),
    name: 'SignIn',
  },
  {
    path: '/recovery-password',
    name: 'RecoveryPassword',
    component: () => import('@/views/auth/RecoveryPassword.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
