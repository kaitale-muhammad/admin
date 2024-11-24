<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Tip"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add Tip"></v-toolbar>

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <input
                type="text"
                v-model="form.title"
                placeholder="Title"
                name="title"
                id="title"
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
                v-model="form.by"
                placeholder="Added By"
                name="by"
                id="by"
                required
              /><br />

              <v-btn
                class="mt-2"
                type="submit"
                color="primary"
                @click="isActive.value = false"
                block
              >
                Add
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
import { ref, reactive, onMounted } from "vue";
import { useToast } from "vue-toastification";

const loading = ref(false);
const toast = useToast();

const form = reactive({
  title: "",
  file: "",
  description: "",
  by: "",
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
  if (!form.title) {
    toast.error("Title is required.");
    return false;
  }
  if (!form.description) {
    toast.error("Description is required.");
    return false;
  }
  if (!form.by) {
    toast.error("Added By is required.");
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
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("image", form.file);
    formData.append("added_by", form.by);

    // Append file if available
    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.post(`/tips`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("Tip added successfully!");
  } catch (error) {
    loading.value = false;
    toast.error("Failed to add the tip");
  }
};
</script>
