<template>
  <div class="not-found">
    <div class="error-container">
      <h1 class="error-code">404</h1>
      <p class="error-message">Oops! Page Not Found</p>
      <router-link to="/" class="home-link">
        <v-btn color="primary" dark>Go Home</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f2f2;
  text-align: center;
}

.error-container {
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 100px;
  margin: 0;
  color: #e53935;
}

.error-message {
  font-size: 24px;
  color: #333;
}

.home-link {
  margin-top: 20px;
}

.home-link .v-btn {
  margin-top: 20px;
}
</style>
