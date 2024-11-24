<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Client Info"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
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
              <input
                type="email"
                v-model="form.email"
                placeholder="Email"
                name="email"
                id="email"
                required
              /><br />
              <input
                type="text"
                v-model="form.site_name"
                placeholder="Site Name"
                name="site_name"
                id="site_name"
                required
              />
              <input
                type="text"
                v-model="form.location"
                placeholder="Location"
                name="location"
                id="location"
                required
              />
              <div class="requirements">
                <input
                  type="number"
                  v-model="form.man_power"
                  placeholder="Man Power"
                  name="man_power"
                  id="man_power"
                />
                <input
                  type="number"
                  v-model="form.gun"
                  placeholder="Gun"
                  name="gun"
                  id="gun"
                />
                <input
                  type="number"
                  v-model="form.dog"
                  placeholder="Dog"
                  name="dog"
                  id="dog"
                />
                <input
                  type="number"
                  v-model="form.baton"
                  placeholder="Baton"
                  name="baton"
                  id="baton"
                />
                <input
                  type="number"
                  v-model="form.touch"
                  placeholder="Touch"
                  name="touch"
                  id="touch"
                />
                <input
                  type="number"
                  v-model="form.radio_call"
                  placeholder="Radio Call"
                  name="radio_call"
                  id="radio_call"
                />
              </div>
              <input
                type="text"
                v-model="form.others"
                placeholder="Others"
                name="others"
                id="others"
              />
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
  padding: 7px;
  border: 1px blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}
.requirements input {
  width: 160px;
}
.requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: space-between;
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
import api from "@/axios";
import { ref, reactive, onMounted } from "vue";
import { useToast } from "vue-toastification";

const loading = ref(false);
const toast = useToast();

const form = reactive({
  name: "",
  contact: "",
  email: "",
  site_name: "",
  location: "",
  man_power: "",
  gun: "",
  dog: "",
  baton: "",
  touch: "",
  radio_call: "",
  others: "",
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
  if (!form.email) {
    toast.error("Email is required.");
    return false;
  }
  if (!form.site_name) {
    toast.error("Site Name is required.");
    return false;
  }
  if (!form.location) {
    toast.error("Location is required.");
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

  // Set empty numeric fields to 0
  form.man_power = form.man_power || 0;
  form.gun = form.gun || 0;
  form.dog = form.dog || 0;
  form.baton = form.baton || 0;
  form.touch = form.touch || 0;
  form.radio_call = form.radio_call || 0;

  try {
    await api.post(`/clients`, form);
    loading.value = false;
    toast.success("Client added successfully!");
    fetch(); // Refresh the list of clients
  } catch (error) {
    loading.value = false;
    toast.error("Failed to add the client.");
  }
};
</script>
