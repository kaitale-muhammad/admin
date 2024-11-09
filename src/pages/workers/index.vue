<template>
  <WorkersWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp;&nbsp;&nbsp; FIND
      WORKER&nbsp;&nbsp;&nbsp;&nbsp;

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search..."
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
      :items-per-page="4"
      :headers="headers"
      hover
    >
      <!-- id, image, worker_id, name, date_of_birth, contact, email, date_joined, site -->
      <template #header.image>
        <div class="text-start">Photo</div>
      </template>
      <template #header.worker_id>
        <div class="text-start">ID</div>
      </template>

      <template #header.name>
        <div class="text-start">Name</div>
      </template>

      <template #header.date_of_birth>
        <div class="text-start">DOB</div>
      </template>
      <template #header.date_added>
        <div class="text-start">Date Added</div>
      </template>
      <template #header.contact>
        <div class="text-start">Contact</div>
      </template>
      <template #header.email>
        <div class="text-start">email</div>
      </template>
      <template #header.date_joined>
        <div class="text-start">Date joined</div>
      </template>
      <template #header.site>
        <div class="text-start">Client ID</div>
      </template>
      <template #header.actions>
        <div class="text-start">Actions</div>
      </template>
      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteEvent(item.id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/workers/${item.id}`">
              <v-icon icon="mdi-pencil" pa="7" class="icon" color="blue">
              </v-icon>
            </router-link>
          </div>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 60px">
          <img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="60"
            height="60"
          />
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import WorkersWrapper from "@/components/workersWrapper.vue";
import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const loading = ref(true);

const toast = useToast();
const route = useRoute();
const id = route.params.id;

const search = ref("");
const items = ref([]);
//id, image, worker_id, name, date_of_birth, contact, email, date_joined, site
const headers = ref([
  { text: "Image", value: "image" },
  { text: "worker_id", value: "worker_id" },
  { text: "name", value: "name" },
  { text: "date_of_birthy", value: "date_of_birth" },
  { text: "contact", value: "contact" },
  { text: "email", value: "email" },
  { text: "date_joined", value: "date_joined" },
  { text: "Client ID", value: "site" },
  { text: "Actions", value: "actions" },
]);

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/workers");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

const deleteEvent = async (id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await axios.delete(`http://localhost:5000/workers/${id}`).then(() => {
        console.log("deleted successfully");
        fetchData();
        toast.success("Deleted successfully");
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const path = useRoute();
</script>

<style scoped>
* {
  overflow: hidden;
}
.icon-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  padding: 7px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
