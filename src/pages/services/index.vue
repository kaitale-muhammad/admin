<template>
  <homeWraper :fetch="fetch" :data="data" />

  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-briefcase-outline"></v-icon> &nbsp;&nbsp;&nbsp; FIND
      SERVICES&nbsp;&nbsp;&nbsp;&nbsp;

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
      :items-per-page="3"
      :headers="headers"
      hover
    >
      <!--  id, service_name, image, descripton, status, date_added, featured -->

      <template #header.service_name>
        <div class="text-start">Name</div>
      </template>

      <template #header.image>
        <div class="text-start">Image</div>
      </template>

      <template #header.descripton>
        <div class="text-start">Description</div>
      </template>
      <!-- <template v-slot="header">
          {{ header.descripton }}
        </template> -->

      <template #header.status>
        <div class="text-start">Status</div>
      </template>
      <template #header.date_added>
        <div class="text-start">Date Added</div>
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
              @click="deleteService(item.id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/services/${item.id}`">
              <v-icon icon="mdi-pencil" pa="7" class="icon" color="blue">
              </v-icon>
            </router-link>
          </div>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 80px">
          <img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="80"
            height="80"
          />
        </v-card>
      </template>
    </v-data-table>
  </v-card>
  <!-- <img src="http://127.0.0.1:5000/imgs/1729795792504-78609318-contact_us.png" /> -->
</template>

<script setup>
import homeWraper from "@/components/homeWraper.vue";
import { useDataStore } from "@/stores/dataStore";
import api from "@/axios";
import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const loading = ref(true);
let data = ref(undefined);

const toast = useToast();
const route = useRoute();
const id = route.params.id;

const datastore = useDataStore();
datastore.getServices();
const search = ref("");
const items = ref([]);
// id, service_name, image, descripton, status, date_added, featured
const headers = ref([
  { text: "Name", value: "service_name" },
  { text: "Image", value: "image" },
  { text: "Description", value: "descripton" },
  { text: "Status", value: "status" },
  { text: "Date Added", value: "date_added" },
  { text: "Actions", value: "actions" },
]);

datastore.getServices().then(() => {
  items.value = datastore.items;
  loading.value = false;
});

const fetchData = async () => {
  try {
    const response = await api.get("/services");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
// onMounted(fetchData);

const deleteService = async (id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await axios.delete(`http://localhost:5000/services/${id}`).then(() => {
        console.log("deleted successfully");
        fetchData();
        toast.success("Deleted successfully");
      });
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
* {
  overflow: hidden;
}
.icon-container {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icons */
}

.icon {
  padding: 7px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Darker on hover */
}
</style>
