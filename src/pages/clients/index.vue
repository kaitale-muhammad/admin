<template>
  <ClientWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-handshake-outline"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND CLIENT &nbsp;&nbsp;&nbsp;&nbsp;

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
        <div class="text-start font-weight-semibold text-primary">ID</div>
      </template>
      <template #header.name>
        <div class="text-start font-weight-semibold text-primary">Name</div>
      </template>
      <template #header.contact>
        <div class="text-start font-weight-semibold text-primary">Contact</div>
      </template>
      <template #header.email>
        <div class="text-start font-weight-semibold text-primary">Email</div>
      </template>
      <template #header.site_name>
        <div class="text-start font-weight-semibold text-primary">
          Site Name
        </div>
      </template>
      <template #header.location>
        <div class="text-start font-weight-semibold text-primary">Location</div>
      </template>
      <template #header.man_power>
        <div class="text-start font-weight-semibold text-primary">
          Man power
        </div>
      </template>
      <template #header.gun>
        <div class="text-start font-weight-semibold text-primary">Gun</div>
      </template>
      <template #header.dog>
        <div class="text-start font-weight-semibold text-primary">Dog</div>
      </template>
      <template #header.baton>
        <div class="text-start font-weight-semibold text-primary">Baton</div>
      </template>
      <template #header.touch>
        <div class="text-start font-weight-semibold text-primary">Touch</div>
      </template>

      <template #header.radio_call>
        <div class="text-start font-weight-semibold text-primary">
          Radio call
        </div>
      </template>
      <template #header.others>
        <div class="text-start font-weight-semibold text-primary">Others</div>
      </template>

      <template #header.actions>
        <div class="text-start font-weight-semibold text-primary">Actions</div>
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
              @click="deleteClients(item.id)"
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
import api from "@/axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
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
    const response = await api.get("/clients");
    items.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

const deleteClients = async (id) => {
  try {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You wan't to delete this!",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    // If the user confirms deletion, proceed
    if (result.isConfirmed) {
      await api.delete(`/clients/${id}`);
      toast.success("Deleted successfully");
      fetchData(); // Reload or fetch updated data
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting client");
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
