// Composables
import { createRouter, createWebHistory } from 'vue-router'
import AppBar from '@/layouts/AppBar.vue';
const routes = [
  {
    path: '/',
    component: () => AppBar,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
        {
          path: '/users',
          name: 'Users',
          component: () => import('@/views/users/Users.vue'),
        },
        {
          path: '/user-form/:userId?',
          name: 'UserForm',
          component: () => import('@/views/users/UserForm.vue'),
        }
      ],

  },
  {
    path: '/sign-in',
    component: () => import('@/views/auth/Login.vue'),
    name: 'SignIn'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
