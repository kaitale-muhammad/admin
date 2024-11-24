<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Control Room"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add Control Room"></v-toolbar>

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <input
                type="text"
                v-model="form.name"
                placeholder="Name"
                name="name"
                id="name"
                required
              /><br />
              <input
                type="text"
                v-model="form.contact"
                placeholder="Contact"
                name="contact"
                id="contact"
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
import { ref, reactive } from "vue";
import { useToast } from "vue-toastification";

const loading = ref(false);
const toast = useToast();

const form = reactive({
  name: "",
  contact: "",
});

// Form validation
const validateForm = () => {
  if (!form.name) {
    toast.error("Name is required.");
    return false;
  }
  if (!form.contact) {
    toast.error("Contact is required.");
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
    await api.post(`/controls`, form);
    loading.value = false;
    toast.success("Control room added successfully!");
  } catch (error) {
    loading.value = false;
    toast.error("Failed to add the Control Room");
  }
};
</script>
