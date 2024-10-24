<template>
  <div class="main">
    <VCard
      width="400px"
      class="card"
      align-center
      elevation="true"
      border="red">
      <VForm @submit.prevent="submitForm">
        {{ id }}
        <input
          type="text"
          v-model="form.service_name"
          placeholder="Service Name" />
        <div class="image">
          <VAvatar :image="'http://localhost:5000/imgs/' + form.file"></VAvatar
          ><input
            type="file"
            v-on:change="handleFileChange"
            placeholder="File" />
        </div>

        <input
          type="text"
          v-model="form.description"
          placeholder="Description" />
        <input type="text" v-model="form.status" placeholder="Status" />

        <v-btn
          class="mt-2"
          :disabled="loading"
          type="submit"
          color="primary"
          block>
          {{ loading ? "loading..." : "Edit" }}
        </v-btn>
      </VForm>
    </VCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const form = reactive({
  service_name: "",
  file: "",
  description: "",
  status: "",
});

const loading = ref(false);
const route = useRoute();
const id = route.params.id;
const toast = useToast();
async function fetch() {
  try {
    const response = await axios.get(`http://localhost:5000/services/${id}`);
    var data = response.data;

    form.service_name = data.service_name || "kk";
    form.file = data.image || "";
    form.description = data.descripton || "";
    form.status = data.status || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load service details");
  }
}
const filedata = ref("");
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    filedata.value = file;
  }
};
onMounted(async () => {
  fetch();
});
const submitForm = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("service_name", form.service_name);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("image", form.file);

    if (filedata.value) {
      formData.append("file", filedata.value); // Append the file if present
    }

    // Make the API request to submit the form with the file
    const response = await axios.put(
      `http://localhost:5000/services/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    loading.value = false;
    toast.success("Service updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update the service");
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
  margin-top: 50px;
}

.card {
  padding: 20px;
}
.image {
  display: flex;
  gap: 5px;
}
</style>
