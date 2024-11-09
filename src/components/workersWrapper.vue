<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="add Worker"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <!-- <v-toolbar title="Add worker"></v-toolbar> -->
            <!-- id, image, worker_id, name, date_of_birth, contact, email, date_joined, site -->

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <p>Photo</p>
              <input type="file" ref="file" @change="handleFileChange" /><br />
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
                class="mt-1"
                type="submit"
                color="primary"
                @click="isActive.value = false"
                block
                >Add</v-btn
              >
            </v-form>

            <v-card-actions class="justify-end">
              <v-btn
                class="text-white text-none rounded-md"
                color="red"
                rounded="0"
                variant="flat"
                @click="isActive.value = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
    <hr />
  </div>
</template>

<style scoped>
.box {
  padding: 10px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: end;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
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

.form {
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
// const loading = ref(true);
// let data = ref(undefined);
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const editing = false;
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

onMounted(() => {
  fetch();
});

const filedata = ref("");
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    filedata.value = file;
  }
};
// id, image, worker_id, name, date_of_birth, contact, email, date_joined, site
const submitForm = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("worker_id", form.worker_id);
    formData.append("name", form.name);
    formData.append("image", form.file);
    formData.append("date_of_birth", form.date_of_birth);
    formData.append("contact", form.contact);
    formData.append("email", form.email);
    formData.append("date_joined", form.date_joined);
    formData.append("site", form.site);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await axios.post(
      `http://localhost:5000/workers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    loading.value = false;
    toast.success("Workser added successfully!");
    // isActive.value = false;
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to add Worker");
  }
};
</script>
