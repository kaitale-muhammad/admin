<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Service"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add a Service"></v-toolbar>

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <input
                type="text"
                v-model="form.service_name"
                placeholder="Service Name"
                name="service_name"
                id="service_name"
                required
              /><br />
              <input type="file" ref="file" @change="handleFileChange" /><br />
              <textarea
                type="text"
                v-model="form.description"
                placeholder="Description"
                name="description"
                required
              ></textarea
              ><br />
              <input
                type="text"
                v-model="form.status"
                name="status"
                id="statuss"
                placeholder="Status"
                required
              /><br />

              <v-btn
                class="mt-2"
                type="submit"
                color="primary"
                @click="isActive.value = false"
                block
              >
                {{ editing ? "Update" : "Add" }}
              </v-btn>
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
  margin-bottom: 10px;
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
</style>

<script setup>
import api from "@/axios";
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const loading = ref(false);
const toast = useToast();

const editing = false;

defineProps({
  fetch: Function,
  data: {
    type: Object,
    default: "Nothing",
  },
});

const form = reactive({
  service_name: "",
  file: "",
  description: "",
  status: "",
});

const check = ref(false);

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

// Validate form data
const validateForm = () => {
  if (!form.service_name) {
    toast.error("Service Name is required.");
    return false;
  }
  if (!form.description) {
    toast.error("Description is required.");
    return false;
  }
  if (!form.status) {
    toast.error("Status is required.");
    return false;
  }
  return true;
};

// Submit the form
const submitForm = async () => {
  // Validate before submission
  if (!validateForm()) {
    return; // Stop form submission if validation fails
  }

  loading.value = true;

  try {
    const formData = new FormData();
    formData.append("service_name", form.service_name);
    formData.append("description", form.description);
    formData.append("status", form.status);

    // Append file if available
    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.post(`/addservices`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("Service added successfully!");
  } catch (error) {
    loading.value = false;
    toast.error("Failed to add the service");
  }
};
</script>
