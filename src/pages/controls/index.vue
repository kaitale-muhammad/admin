<template>
  <ControlWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-phone"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND CONTROL ROOM&nbsp;&nbsp;&nbsp;&nbsp;

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
      <!-- control_id, name, contact -->

      <template #header.name>
        <div class="text-start font-weight-semibold text-primary">Name</div>
      </template>
      <!-- <template v-slot="header">
            {{ header.descripton }}
          </template> -->

      <template #header.contact>
        <div class="text-start font-weight-semibold text-primary">Contact</div>
      </template>

      <template #header.actions>
        <div class="text-start font-weight-semibold text-primary">Actions</div>
      </template>

      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteControl(item.control_id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/controls/${item.control_id}`">
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
import ControlWrapper from "@/components/controlWrapper.vue";
import api from "@/axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
const loading = ref(true);

const toast = useToast();
const route = useRoute();
const control_id = route.params.id;

const search = ref("");
const items = ref([]);
//control_id, name, contact
const headers = ref([
  { text: "Name", value: "name" },
  { text: "Contact", value: "contact" },

  { text: "Actions", value: "actions" },
]);

const fetchData = async () => {
  try {
    const response = await api.get("/controls");
    items.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

const deleteControl = async (control_id) => {
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
      await api.delete(`/controls/${control_id}`);
      toast.success("Deleted successfully");
      fetchData(); // Reload or fetch updated data
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting control");
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
