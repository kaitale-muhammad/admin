<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp; Find User

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table
      v-model:search="search"
      :items="items"
      :items-per-page="5"
      :headers="headers"
      hover
    >
      <!-- user_id, name, email, contact, profileImage, date_created -->
      <template #header.profileImage>
        <div class="text-start">Profile Image</div>
      </template>
      <template #header.name>
        <div class="text-start">Name</div>
      </template>

      <template #header.contact>
        <div class="text-start">Contact</div>
      </template>
      <template #header.email>
        <div class="text-start">Email</div>
      </template>
      <!-- <template v-slot="header">
        {{ header.descripton }}
      </template> -->

      <template #header.date_created>
        <div class="text-start">Added Added</div>
      </template>

      <template #item.profileImage="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 60px">
          <img
            :src="`http://localhost:5000${item.profileImage}`"
            width="60"
            height="60"
          />
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const search = ref("");
const items = ref([]);
const loading = ref(true);

//user_id, name, email, contact, profileImage, date_created
const headers = ref([
  { text: "Image", value: "profileImage" },
  { text: "Name", value: "name" },
  { text: "Contact", value: "contact" },
  { text: "Email", value: "email" },
  { text: "Date Added", value: "date_created" },
]);

// user_id, name, email, contact, profileImage, date_created
const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/allusers");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);
</script>
