<template>
  <ClientWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp;&nbsp;&nbsp; FIND CLIENT
      &nbsp;&nbsp;&nbsp;&nbsp;

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
      :items-per-page="6"
      :headers="headers"
      hover
    >
      <!-- id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added -->
      <template #header.id>
        <div class="text-start">ID</div>
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
      <template #header.site_name>
        <div class="text-start">Site Name</div>
      </template>
      <template #header.location>
        <div class="text-start">Location</div>
      </template>
      <template #header.man_power>
        <div class="text-start">Man power</div>
      </template>
      <template #header.gun>
        <div class="text-start">Gun</div>
      </template>
      <template #header.dog>
        <div class="text-start">Dog</div>
      </template>
      <template #header.baton>
        <div class="text-start">Baton</div>
      </template>
      <template #header.touch>
        <div class="text-start">Touch</div>
      </template>

      <template #header.radio_call>
        <div class="text-start">Radio call</div>
      </template>
      <template #header.others>
        <div class="text-start">Others</div>
      </template>

      <template #header.actions>
        <div class="text-start">Actions</div>
      </template>

      <!-- id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added -->
      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteControl(item.id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/clients/${item.id}`">
              <v-icon icon="mdi-pencil" pa="7" class="icon" color="blue">
              </v-icon>
            </router-link>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import ClientWrapper from "@/components/clientWrapper.vue";
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
//id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added
const headers = ref([
  { text: "ID", value: "id" },
  { text: "Name", value: "name" },
  { text: "Contact", value: "contact" },
  { text: "Email", value: "email" },
  { text: "Site Name", value: "site_name" },
  { text: "Location", value: "location" },
  { text: "Man power", value: "man_power" },
  { text: "Gun", value: "gun" },
  { text: "Dog", value: "dog" },
  { text: "Baton", value: "baton" },
  { text: "Touch", value: "touch" },
  { text: "Radio Call", value: "radio_call" },
  { text: "Others", value: "others" },

  { text: "Actions", value: "actions" },
]);

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/clients");
    items.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

const deleteControl = async (id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await axios.delete(`http://localhost:5000/clients/${id}`).then(() => {
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
