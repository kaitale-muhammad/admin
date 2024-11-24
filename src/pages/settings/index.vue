<template>
  <div class="main">
    <div class="content">
      <VCard>
        <div class="top">
          <v-btn class="text-none me-2" @click="back" height="48" icon slim>
            <v-avatar color="info">
              <v-icon icon="mdi-arrow-left-thick" color="white"></v-icon>
            </v-avatar>
          </v-btn>
        </div>

        <b>Email: </b> {{ form.email }}<br /><br />
        <hr />
        <b>Password:</b>{{ form.password }} ****** <br />
      </VCard>
    </div>

    <VCard
      width="400px"
      class="card"
      align-center
      elevation="true"
      border="red"
    >
      <VForm @submit.prevent="submitForm">
        <input type="text" v-model="form.email" placeholder="Email" />
        <!-- <input
          type="password"
          v-model="form.password"
          placeholder="Current Password"
        /> -->
        <input
          type="password"
          v-model="form.newpassword"
          placeholder="New Password"
        />

        <v-btn class="mt-2" type="submit" color="primary" block> Update </v-btn>
      </VForm>
    </VCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios";
import { useToast } from "vue-toastification";
// import api from "js-cookie";

const router = useRouter();
const form = reactive({
  email: "",
  newpassword: "",
  // password: "",
});
const loading = ref(false);
const toast = useToast();

const back = () => {
  router.go(-1);
};

async function fetch() {
  try {
    const response = await api.get("/admin");
    const data = response.data;

    form.email = data[0].email || "";
    // form.password = data[0].password || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load admin");
  }
}

onMounted(() => {
  fetch();
});

const submitForm = async () => {
  loading.value = true;
  try {
    const response = await api.get("/admin");
    const data = response.data;

    await api.put("/admin", {
      email: form.email,
      newpassword: form.newpassword,
    });
    loading.value = false;
    toast.success("Updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update");
  }
};
</script>

<style scoped>
* {
  overflow: hidden;
}

.top {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: none;
  margin-bottom: 10px;
}
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}

.main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 30px;
  overflow: hidden;
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
}
</style>
