<template>
  <div>
    <LoginLayout v-if="isLoginPage">
      <router-view />
    </LoginLayout>
    <MainLayout v-else />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
import LoginLayout from "./layouts/LoginLayout.vue";

const route = useRoute();
const isLoginPage = computed(() => route.path === "/login");
</script>

<style scoped>
/* Add any specific styles for the main app if needed */
</style>
