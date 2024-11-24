<template>
  <div class="main">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="6">
          <div class="content">
            <VCard>
              <div class="top">
                <v-btn
                  class="text-none me-2"
                  @click="back"
                  height="48"
                  icon
                  slim
                >
                  <v-avatar color="info">
                    <v-icon icon="mdi-arrow-left-thick" color="white"></v-icon>
                  </v-avatar>
                </v-btn>

                <b style="margin-left: 10px">{{ form.service_name }}</b
                ><br />
              </div>

              <img
                :src="`https://backendpsl.up.railway.app/uploads/` + form.file"
                width="100%"
                height="200"
              /><br /><br />

              {{ form.description }}<br /><br />
              <hr />
              <b>Status: </b>{{ form.status }}
            </VCard>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="6">
          <VCard
            width="400px"
            class="card"
            align-center
            elevation="true"
            border="red"
          >
            <VForm @submit.prevent="submitForm">
              <input
                type="text"
                v-model="form.service_name"
                placeholder="Service Name"
              />
              <div class="image">
                <VAvatar
                  :image="
                    'https://backendpsl.up.railway.app/uploads/' + form.file
                  "
                ></VAvatar>
                <input
                  type="file"
                  v-on:change="handleFileChange"
                  placeholder="File"
                />
              </div>

              <textarea
                type="text"
                v-model="form.description"
                placeholder="Description"
                rows="6"
              ></textarea>
              <input type="text" v-model="form.status" placeholder="Status" />

              <div>
                <v-checkbox
                  label="Featured"
                  v-model="form.featured"
                  :value="true"
                  :false-value="false"
                ></v-checkbox>
              </div>

              <v-btn
                class="mt-2"
                :disabled="loading"
                type="submit"
                color="primary"
                block
              >
                {{ loading ? "loading..." : "Edit" }}
              </v-btn>
            </VForm>
          </VCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const form = reactive({
  service_name: "",
  file: "",
  description: "",
  status: "",
  featured: false, // Default value should be false
});

const back = () => {
  router.go(-1);
};

const loading = ref(false);
const route = useRoute();
const id = route.params.id;
const toast = useToast();

async function fetch() {
  try {
    const response = await api.get(`/services/${id}`);
    var data = response.data;

    form.service_name = data.service_name || "kk";
    form.file = data.image || "";
    form.description = data.descripton || "";
    form.status = data.status || "";
    form.featured = data.featured === 1 || data.featured === true; // Convert to boolean
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
    formData.append("featured", form.featured ? 1 : 0); // Send as 1 or 0
    formData.append("image", form.file);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.put(`/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
