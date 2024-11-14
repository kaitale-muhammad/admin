<template>
  <WorkersWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-account-hard-hat-outline"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND WORKER&nbsp;&nbsp;&nbsp;&nbsp;

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
      class="elevation-1 my-4 custom-table"
      hover
      dense
    >
      <!-- id, image, worker_id, name, date_of_birth, contact, email, date_joined, site -->
      <template #header.image>
        <div class="text-start font-weight-semibold text-primary">Photo</div>
      </template>
      <template #header.worker_id>
        <div class="text-start font-weight-semibold text-primary">ID</div>
      </template>

      <template #header.name>
        <div class="text-start font-weight-semibold text-primary">Name</div>
      </template>

      <template #header.date_of_birth>
        <div class="text-start font-weight-semibold text-primary">DOB</div>
      </template>
      <template #header.date_added>
        <div class="text-start font-weight-semibold text-primary">
          Date Added
        </div>
      </template>
      <template #header.contact>
        <div class="text-start font-weight-semibold text-primary">Contact</div>
      </template>
      <template #header.email>
        <div class="text-start font-weight-semibold text-primary">email</div>
      </template>
      <template #header.date_joined>
        <div class="text-start font-weight-semibold text-primary">
          Date joined
        </div>
      </template>
      <template #header.site>
        <div class="text-start font-weight-semibold text-primary">
          Client ID
        </div>
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
              @click="deleteWorker(item.id)"
            ></v-icon>
          </div>

          <v-btn class="text-none" icon small>
            <v-icon icon="mdi-dots-vertical" color="blue" pa="7"></v-icon>

            <!-- Menu for actions -->
            <v-menu activator="parent">
              <v-list density="compact" nav>
                <!-- Edit option -->
                <router-link class="edit" :to="`/workers/${item.id}`">
                  <v-list-item append-icon="mdi-pencil" link title="Edit" />
                </router-link>

                <!-- Dialog for Attendance -->
                <v-dialog transition="dialog-top-transition" pa-4>
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-list-item
                      v-bind="activatorProps"
                      append-icon="mdi-calendar"
                      link
                      title="Attendance"
                    />
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card align-center>
                      <div class="container">
                        <UserAttendance :user-attendance-records="item" />
                      </div>
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
              </v-list>
            </v-menu>
          </v-btn>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 60px">
          <img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="60"
            height="60"
            @click="openImageDialog(item.image)"
          />
        </v-card>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="imageDialog" max-width="500px">
    <v-card style="padding: 10px">
      <v-img
        :src="`http://localhost:5000/imgs/${currentImage}`"
        height="400px"
        width="100%"
      ></v-img>
      <v-card-actions>
        <v-btn color="primary" text @click="imageDialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import WorkersWrapper from "@/components/workersWrapper.vue";
import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import UserAttendance from "../attendance/UserAttendance.vue";
import Swal from "sweetalert2";
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

const deleteWorker = async (id) => {
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
      await axios.delete(`http://localhost:5000/workers/${id}`);
      toast.success("Deleted successfully");
      fetchData(); // Reload or fetch updated data
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting worker");
  }
};

// Dialog state
const imageDialog = ref(false);
const currentImage = ref("");

// Function to open image dialog
const openImageDialog = (image) => {
  currentImage.value = image;
  imageDialog.value = true;
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
.edit {
  text-decoration: none;
}
.icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.container {
  height: 100%;
  overflow-y: scroll;
}

.my-chip {
  background-color: transparent !important;
  /* Optional: change text color to black or any color */
  border: none; /* Optional: add a subtle border */
}
</style>
