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
            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <p>Photo</p>
              <input type="file" ref="file" @change="handleFileChange" /><br />

              <input
                type="text"
                v-model="form.worker_id"
                placeholder="Worker ID"
                name="id"
                id="id"
                required
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
                name="contact"
                required
              />

              <input
                type="email"
                v-model="form.email"
                placeholder="Email"
                name="email"
                required
              />
              <p>date joined</p>
              <div id="title">
                <input
                  type="date"
                  v-model="form.date_joined"
                  placeholder="Date joined"
                  name="date_joined"
                  required
                />

                <input
                  type="text"
                  v-model="form.title"
                  placeholder="Title"
                  name="name"
                  required
                />
              </div>

              <div class="form-row">
                <input
                  type="number"
                  v-model="form.site"
                  placeholder="Client ID"
                  name="cid"
                  id="cid"
                  style="width: auto; margin-right: 10px"
                  required
                />

                <div class="supervisor-checkbox">
                  <p>Supervisor</p>
                  <div>
                    <VCheckbox v-model="form.supervisor" />
                  </div>
                </div>
              </div>

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
  border: 1px blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 7px;
  height: 40px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}

.form {
  align-items: center;
  justify-content: center;
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

div #title {
  display: flex;
}
div #title input {
  margin-left: 10px;
}
</style>
<script setup>
import api from "@/axios";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const loading = ref(false);
const router = useRouter();
const toast = useToast();

const form = reactive({
  file: "",
  worker_id: "",
  name: "",
  date_of_birth: "",
  contact: "",
  email: "",
  date_joined: "",
  title: "",
  site: "",
  supervisor: 0, // Default to 0 (unchecked)
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

const submitForm = async () => {
  loading.value = true;

  // Check for required fields
  if (
    !form.worker_id ||
    !form.name ||
    !form.date_of_birth ||
    !form.contact ||
    !form.site
  ) {
    toast.error("All required fields must be filled!");
    loading.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append("worker_id", form.worker_id);
    formData.append("name", form.name);
    formData.append("image", form.file);
    formData.append("date_of_birth", form.date_of_birth);
    formData.append("contact", form.contact);
    formData.append("email", form.email);
    formData.append("date_joined", form.date_joined);
    formData.append("title", form.title);
    formData.append("site", form.site);

    // Convert supervisor to string before appending
    formData.append("supervisor", form.supervisor ? "1" : "0");

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.post(`/workers`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("Worker added successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to add Worker");
  }
};
</script>
