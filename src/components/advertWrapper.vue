<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="add Advert"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add Advert"></v-toolbar>

            <v-form @submit.prevent="submitForm" class="pa-4 form">
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
const router = useRouter();
const toast = useToast();

const form = reactive({
  file: "",
  description: "",
  by: "",
  date_to_occur: "",
});

const filedata = ref("");
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    filedata.value = file;
  }
};

// Form validation logic
const validateForm = () => {
  if (!form.description) {
    toast.error("Description is required.");
    return false;
  }
  if (!form.by) {
    toast.error("Added By is required.");
    return false;
  }
  if (!filedata.value) {
    toast.error("Image file is required.");
    return false;
  }
  return true;
};

const submitForm = async () => {
  // Validate form before submitting
  if (!validateForm()) {
    return; // Stop form submission if validation fails
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("description", form.description);
    formData.append("image", form.file);
    formData.append("added_by", form.by);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.post(`/adverts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("Advert added successfully!");
    fetch(); // Refresh the list of adverts
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to add the advert");
  }
};
</script>
