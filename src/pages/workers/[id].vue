<template>
  <div class="main">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="6">
          <div class="content">
            <v-card class="pa-4" max-width="400px" v-if="form">
              <!-- Header Section -->
              <div class="d-flex align-center mb-4">
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
                <span class="headline">{{ form.name }}</span>
              </div>

              <!-- Image Section -->
              <v-img
                :src="`http://localhost:5000/imgs/` + form.file"
                height="200"
                class="mb-4"
                contain
              ></v-img>

              <!-- Worker Details Section -->
              <v-divider></v-divider>
              <div class="my-1">
                <div class="d-flex justify-between mb-1">
                  <b>Worker ID:</b> <span>{{ form.worker_id }}</span>
                </div>
                <div class="d-flex justify-between mb-1">
                  <b>Name:</b> <span>{{ form.name }}</span>
                </div>
                <div class="d-flex justify-between mb-1">
                  <b>Date of Birth:</b> <span>{{ form.date_of_birth }}</span>
                </div>
                <div class="d-flex justify-between mb-1">
                  <b>Contact:</b> <span>{{ form.contact }}</span>
                </div>
                <div class="d-flex justify-between mb-2">
                  <b>Email:</b> <span>{{ form.email }}</span>
                </div>
                <div class="d-flex justify-between mb-1">
                  <b>Date Joined:</b> <span>{{ form.date_joined }}</span>
                </div>
                <div class="d-flex justify-between mb-1">
                  <b>Client ID:</b> <span>{{ form.site }}</span>
                </div>
              </div>
            </v-card>
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
              <div class="image">
                <VAvatar
                  :image="'http://localhost:5000/imgs/' + form.file"
                ></VAvatar
                ><input
                  type="file"
                  v-on:change="handleFileChange"
                  placeholder="File"
                />
              </div>

              <input
                type="text"
                v-model="form.worker_id"
                placeholder="Worker ID"
                name="id"
                id="id"
              />
              <input
                type="text"
                v-model="form.name"
                placeholder="Name"
                name="name"
                required
              />
              <p>date of birth</p>
              <input
                type="date"
                v-model="form.date_of_birth"
                placeholder="Date of birth"
                name="dob"
                required
              />
              <input
                type="text"
                v-model="form.contact"
                placeholder="Contact"
                name="name"
                required
              />
              <input
                type="email"
                v-model="form.email"
                placeholder="Email"
                name="email"
              />
              <p>date joined</p>
              <input
                type="date"
                v-model="form.date_joined"
                placeholder="Date joined"
                name="name"
              />
              <!-- <input
          type="number"
          v-model="form.site"
          placeholder="Client ID"
          name="cid"
          id="cid"
        /> -->

              <div class="form-row">
                <input
                  type="number"
                  v-model="form.site"
                  placeholder="Client ID"
                  name="cid"
                  id="cid"
                  style="width: auto; margin-right: 10px"
                />
                <div class="supervisor-checkbox">
                  <p>Supervisor</p>
                  <div>
                    <VCheckbox v-model="form.supervisor" />
                  </div>
                </div>
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
import axios from "axios";
import { useToast } from "vue-toastification";

const router = useRouter();
// id, image, worker_id, name, date_of_birth, contact, email, date_joined, site
const form = reactive({
  file: "",
  worker_id: "",
  name: "",
  date_of_birth: "",
  contact: "",
  email: "",
  date_joined: "",
  site: "",
  supervisor: "",
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
    const response = await axios.get(`http://localhost:5000/workers/${id}`);
    var data = response.data;

    form.worker_id = data.worker_id || "kk";
    form.file = data.image || "";
    form.name = data.name || "";
    form.date_of_birth = data.date_of_birth || "";
    form.contact = data.contact || "";
    form.email = data.email || "";
    form.date_joined = data.date_joined || "";
    form.site = data.site || "";
    // Set supervisor to true if it's 1, otherwise false
    form.supervisor = data.supervisor === 1;
  } catch (err) {
    console.error(err);
    toast.error("Failed to load worker");
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
    formData.append("worker_id", form.worker_id);
    formData.append("name", form.name);
    formData.append("date_of_birth", form.date_of_birth);
    formData.append("contact", form.contact);
    formData.append("email", form.email);
    formData.append("date_joined", form.date_joined);
    formData.append("site", form.site);
    // If supervisor is true, save as "1", otherwise "0"
    formData.append("supervisor", form.supervisor ? "1" : "0");

    formData.append("image", form.file);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await axios.put(
      `http://localhost:5000/workers/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    loading.value = false;
    toast.success("Worker updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update Worker");
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
  margin-bottom: 7px;
  height: 40px;
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
  width: 300px;
}
.card {
  padding: 20px;
}
.image {
  display: flex;
  gap: 5px;
}

/*  */

.v-card {
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.headline {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.v-divider {
  margin: 10px 0;
}

.d-flex {
  display: flex;
}

.d-flex.justify-between {
  justify-content: space-between;
}

.mb-4 {
  margin-bottom: 10px;
}

.my-4 {
  margin-top: 10px;
}

.mb-2 {
  margin-bottom: 8px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px; /* Adds space between elements */
}

.supervisor-checkbox {
  display: flex;
  align-items: center;
  gap: 8px; /* Adds space between "Supervisor" and the checkbox */
}

.supervisor-checkbox p {
  margin: 0;
}
</style>
