<template>
  <div class="main">
    <div class="content">
      <VCard>
        <div class="top">
          <v-btn class="text-none me-2" @click="back" height="48" icon slim>
            <v-avatar color="info">
              <v-icon icon="mdi-arrow-left-thick" color="white"></v-icon>
            </v-avatar>
          </v-btn>

          <!-- chevron-left -->
        </div>

        <b>Control Room: </b> {{ form.name }}<br /><br />
        <hr />
        <b>Contact:</b> {{ form.contact }} <br />
      </VCard>
    </div>

    <VCard
      width="400px"
      class="card"
      align-center
      elevation="true"
      border="red"
    >
      <VForm @submit.prevent="submitForm">
        <!-- {{ notes_id }} -->

        <input type="text" v-model="form.name" placeholder="Name" />
        <input type="text" v-model="form.contact" placeholder="Contact" />

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
import axios from "axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const form = reactive({
  name: "",
  contact: "",
});

const back = () => {
  router.go(-1);
};
// control_id, name, contact
const loading = ref(false);
const route = useRoute();
const control_id = route.params.control_id;
const toast = useToast();
async function fetch() {
  try {
    const response = await axios.get(
      `http://localhost:5000/controls/${control_id}`
    );
    var data = response.data;

    form.name = data.name || "";
    form.contact = data.contact || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load Adverts");
  }
}
// const filedata = ref("");
// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     filedata.value = file;
//   }
// };
onMounted(async () => {
  fetch();
});
const submitForm = async () => {
  loading.value = true;
  try {
    // advert_id, image, description, added_by, date_added
    // const formData = new FormData();

    // formData.append("description", form.description);
    // formData.append("added_by", form.added_by);

    // formData.append("image", form.file);

    // if (filedata.value) {
    //   formData.append("file", filedata.value);
    // }

    await axios.put(`http://localhost:5000/controls/${control_id}`, form);
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
textarea {
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
