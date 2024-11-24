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
import api from "@/axios";
import { useToast } from "vue-toastification";
import Cookies from "js-cookie"; // Import js-cookie

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
    const response = await api.post("/adminlogin", {
      email: form.email,
      password: form.password,
    },
{ withCredentials: true }
).then((response) => {
    console.log('Login successful:', response.data);
  })
  .catch((error) => {
    console.error('Error during login:', error);
  });
    
  // console.log("Response from backend:", response.data);

  //   axios
  // .post(
  //   'https://backendpsl.up.railway.app/admin',
  //   { email, password },
  //   { withCredentials: true } // Include cookies
  // )
  // .then((response) => {
  //   console.log('Login successful:', response.data);
  // })
  // .catch((error) => {
  //   console.error('Error during login:', error);
  // });


    // Check if the backend sends a success message and token
    if (response.status === 200 && response.data.token) {
      const user = { email: form.email, token: response.data.token };
      Cookies.set("auth_token", response.data.token, { expires: 1 });

      toast.success("Login successful");

      // Redirect to the dashboard
      router.push({ path: "/" });
    } else {
      toast.error("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
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
