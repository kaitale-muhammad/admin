import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";
import LoginLayout from "../layouts/LoginLayout.vue";
import NotFound from "../pages/NotFound.vue";

const modifiedRoutes = routes.map((route) => {
  if (route.path === "/login") {
    route.meta = { layout: LoginLayout };
  }
  return route;
});

// Add the NotFound route with a specific meta field
modifiedRoutes.push({
  path: "/:catchAll(.*)*",
  name: "NotFound",
  component: NotFound,
  meta: { hideSidebarAndAppBar: true },
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: modifiedRoutes,
});

// Authentication guard
import Cookies from "js-cookie";

router.beforeEach((to, from, next) => {
  const favicon = document.querySelector("link[rel='icon']");
  favicon.href = "/bglogo.png";

  // Check if the auth_token cookie exists to determine if the user is authenticated
  const isAuthenticated = !!Cookies.get("auth_token");

  if (to.path !== "/login" && !isAuthenticated) {
    next("/login"); // Redirect to login if not authenticated
    router.push("/");
  } else {
    next(); // Proceed to route
  }
});

export default router;
