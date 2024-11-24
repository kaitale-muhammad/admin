<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Event"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add Event"></v-toolbar>

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
              <input
                type="date"
                v-model="form.date_to_occur"
                placeholder="Date to Occur"
                name="date_to_occur"
                id="date_to_occur"
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
  date_to_occur: "",
});

const filedata = ref("");

// Handle file change
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
  if (!form.date_to_occur) {
    toast.error("Date to Occur is required.");
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
    formData.append("added_by", form.by);
    formData.append("date_to_occur", form.date_to_occur);

    // Append file if available
    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.post(`/events`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("Event added successfully!");
  } catch (error) {
    loading.value = false;
    toast.error("Failed to add the event");
  }
};
</script>
