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

          <b style="margin-left: 10px">{{ form.name }}</b
          ><br />
          <!-- chevron-left -->
        </div>

        <img
          :src="`http://localhost:5000/imgs/` + form.file"
          width="100%"
          height="150"
        /><br /><br />

        <hr />
        <!-- id, image, worker_id, name, date_of_birth, contact, email, date_joined, site -->
        <b>Worker ID</b> {{ form.worker_id }} <br />
        <b>Name:</b> {{ form.name }} <br />
        <b>Date of Birth:</b> {{ form.date_of_birth }} <br />
        <b>Contact:</b> {{ form.contact }} <br />
        <b>Email:</b> {{ form.email }} <br />
        <b>Date Joined:</b> {{ form.date_joined }} <br />
        <b>Client ID:</b> {{ form.site }}
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
        <div class="image">
          <VAvatar :image="'http://localhost:5000/imgs/' + form.file"></VAvatar
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
        <input
          type="number"
          v-model="form.site"
          placeholder="Client ID"
          name="cid"
          id="cid"
        />

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
    // id, image, worker_id, name, date_of_birth, contact, email, date_joined, site

    form.worker_id = data.worker_id || "kk";
    form.file = data.image || "";
    form.name = data.name || "";
    form.date_of_birth = data.date_of_birth || "";
    form.contact = data.contact || "";
    form.email = data.email || "";
    form.date_joined = data.date_joined || "";
    form.site = data.site || "";
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
    // id, image, worker_id, name, date_of_birth, contact, email, date_joined, site
    const formData = new FormData();
    formData.append("worker_id", form.worker_id);
    formData.append("name", form.name);
    formData.append("date_of_birth", form.date_of_birth);
    formData.append("contact", form.contact);
    formData.append("email", form.email);
    formData.append("date_joined", form.date_joined);
    formData.append("site", form.site);

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
    toast.error("Failed to update  Worker");
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
</style>
