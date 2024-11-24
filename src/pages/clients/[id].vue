<template>
  <div class="main">
    <div class="content">
      <VCard width="400px" class="card" align-center elevation="true">
        <div class="top">
          <v-btn class="text-none me-2" @click="back" height="48" icon slim>
            <v-avatar color="info">
              <v-icon icon="mdi-arrow-left-thick" color="white"></v-icon>
            </v-avatar>
          </v-btn>

          <!-- chevron-left -->
        </div>
        <!-- id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added -->
        <b>Name: </b> {{ form.name }}<br />

        <b>Contact:</b> {{ form.contact }} <br />
        <b>Email: </b> {{ form.email }}<br /><br />
        <b>Site Name: </b> {{ form.site_name }}<br /><br />
        <b>Location: </b> {{ form.location }}<br /><br />
        <b>Man power: </b> {{ form.man_power }}<br /><br />
        <b>Gun: </b> {{ form.gun }}<br /><br />
        <b>Dog: </b> {{ form.dog }}<br /><br />
        <b>Baton: </b> {{ form.baton }}<br /><br />
        <b>Touch: </b> {{ form.touch }}<br /><br />
        <b>Radio Call: </b> {{ form.radio_call }}<br /><br />
        <b>Others: </b> {{ form.others }}<br /><br />
      </VCard>
    </div>

    <VCard width="400px" class="card" align-center elevation="true">
      <VForm @submit.prevent="submitForm">
        <input
          type="text"
          v-model="form.name"
          placeholder="Name"
          name="by"
          id="by"
        /><br />
        <input
          type="text"
          v-model="form.contact"
          placeholder="Contact"
          name="by"
          id="by"
        /><br /><input
          type="email"
          v-model="form.email"
          placeholder="Email"
          name="by"
          id="by"
        /><br />
        <input
          type="text"
          v-model="form.site_name"
          placeholder="Site Name"
          name="by"
          id="by"
        />
        <input
          type="text"
          v-model="form.location"
          placeholder="Location"
          name="by"
          id="by"
        />
        <div class="requirements">
          <!-- man_power, gun,dog, baton, touch, radio_call, occurance_book, -->
          <input
            type="number"
            v-model="form.man_power"
            placeholder="man power"
            name="man_power"
            id="by"
            autocomplete="no"
          /><input
            type="number"
            v-model="form.gun"
            placeholder="Gun"
            name="by"
            id="by"
            autocomplete="no"
          /><input
            type="number"
            v-model="form.dog"
            placeholder="Dog"
            name="by"
            id="by"
            autocomplete="no"
          /><input
            type="number"
            v-model="form.baton"
            placeholder="Baton"
            name="by"
            id="by"
            autocomplete="no"
          /><input
            type="number"
            v-model="form.touch"
            placeholder="Touch"
            name="by"
            id="by"
            autocomplete="no"
          /><input
            type="number"
            v-model="form.radio_call"
            placeholder="Radio call"
            name="by"
            id="by"
            autocomplete="no"
          />
        </div>
        <input
          type="text"
          v-model="form.others"
          placeholder="Others"
          name="by"
          id="by"
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
import api from "@/axios";
import { useToast } from "vue-toastification";

const router = useRouter();
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
const back = () => {
  router.go(-1);
};
// control_id, name, contact
const loading = ref(false);
const route = useRoute();
const id = route.params.id;
const toast = useToast();
async function fetch() {
  try {
    const response = await api.get(`/clients/${id}`);
    var data = response.data;
    // id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added
    form.name = data.name || "";
    form.contact = data.contact || "";
    form.email = data.email || "";
    form.site_name = data.site_name || "";
    form.location = data.location || "";
    form.man_power = data.man_power || "";
    form.gun = data.gun || "";
    form.dog = data.dog || "";
    form.baton = data.baton || "";
    form.touch = data.touch || "";
    form.radio_call = data.radio_call || "";
    form.radio_call = data.radio_call || "";
    form.others = data.others || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load Adverts");
  }
}

onMounted(async () => {
  fetch();
});
const submitForm = async () => {
  loading.value = true;

  // Set empty numeric fields to 0
  form.man_power = form.man_power || 0;
  form.gun = form.gun || 0;
  form.dog = form.dog || 0;
  form.baton = form.baton || 0;
  form.touch = form.touch || 0;
  form.radio_call = form.radio_call || 0;

  try {
    await api.put(`/clients/${id}`, form);
    loading.value = false;
    toast.success("Updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update");
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
tex textarea {
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
  width: 400px;
}
.card {
  padding: 20px;
}
.image {
  display: flex;
  gap: 5px;
}
</style>
