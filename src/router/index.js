import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import LoginLayout from '../layouts/LoginLayout.vue'

const modifiedRoutes = routes.map(route => {
  if (route.path === '/login') {
    route.meta = { layout: LoginLayout }
  }
  return route
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: modifiedRoutes,
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user'); // Check if user is authenticated

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to route
  }
})

export default router
