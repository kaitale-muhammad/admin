<template>
  <div class="main">
    <VCard width="400px" class="card" align-center elevation="2">
      <VForm @submit.prevent="login">
        <div class="image">
          <img src="@/assets/logo.jfif" height="100" />
        </div>
        <br />
        <input type="email" v-model="form.email" required placeholder="Email" />
        <input
          type="password"
          v-model="form.password"
          required
          placeholder="Password"
        />
        <v-btn
          class="mt-2"
          :disabled="loading"
          type="submit"
          color="primary"
          block
        >
          LOGIN
        </v-btn>
      </VForm>
    </VCard>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const form = reactive({
  email: "",
  password: "",
});
const loading = ref(false);
const toast = useToast();

const login = async () => {
  loading.value = true;
  try {
    // Simulate a login API request
    const response = await axios.post("http://localhost:5000/admin", {
      email: form.email,
      password: form.password,
    });
    if ((form.email != "") | (form.password != "")) {
      if (response.data.success) {
        const user = { email: response.data.id, token: response.data.token };
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful");
        router.push({ path: "/" });
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      toast.error("All fields are required");
    }
  } catch (error) {
    toast.error("Invalid credentials");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: none;
  margin-bottom: 10px;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
  background-color: ghostwhite;
  height: 100vh;
  width: 100%;
}
.content {
  width: 400px;
}
.card {
  padding: 20px;
}
.image {
  display: flex;
  gap: 5px;
  justify-content: center;
}
</style>
