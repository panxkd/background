import { createRouter, createWebHashHistory } from 'vue-router'
import ViewProduct from '@/views/ViewProduct.vue'
import AddProduct from '@/views/AddProduct.vue'
import ViewOrder from '@/views/ViewOrder.vue'
import ViewDiscovery from '@/views/ViewDiscovery.vue'
import AddDiscovery from '@/views/AddDiscovery.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home.vue')
  },
  { path: '/view-product', component: ViewProduct },
  { path: '/add-product', component: AddProduct },
  { path: '/view-order', component: ViewOrder },
  { path: '/view-discovery', component: ViewDiscovery },
  { path: '/add-discovery', component: AddDiscovery }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
