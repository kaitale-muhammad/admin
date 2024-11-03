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

          <b style="margin-left: 10px">{{ form.title }}</b
          ><br />
          <!-- chevron-left -->
        </div>

        <img
          :src="`http://localhost:5000/imgs/` + form.file"
          width="100%"
          height="200"
        /><br /><br />

        {{ form.description }}<br /><br />
        <hr />
        <b>By:</b> {{ form.added_by }} <br />
        <b>When:</b> {{ form.date_to_occur }}
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

        <input type="text" v-model="form.title" placeholder="Title" />
        <div class="image">
          <VAvatar :image="'http://localhost:5000/imgs/' + form.file"></VAvatar
          ><input
            type="file"
            v-on:change="handleFileChange"
            placeholder="File"
          />
        </div>

        <textarea
          type="text"
          v-model="form.description"
          placeholder="Description"
        ></textarea>
        <input type="text" v-model="form.added_by" placeholder="Added By" />
        <input
          type="date"
          v-model="form.date_to_occur"
          placeholder="Date to Occur"
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
import axios from "axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const form = reactive({
  title: "",
  file: "",
  description: "",
  added_by: "",
});

const back = () => {
  router.go(-1);
};

const loading = ref(false);
const route = useRoute();
const event_id = route.params.event_id;
const toast = useToast();
async function fetch() {
  try {
    const response = await axios.get(
      `http://localhost:5000/events/${event_id}`
    );
    var data = response.data;

    form.title = data.title || "kk";
    form.file = data.image || "";
    form.description = data.description || "";
    form.added_by = data.added_by || "";
    form.date_to_occur = data.date_to_occur || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load events");
  }
}
const filedata = ref("");
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    filedata.value = file;
  }
};
onMounted(async () => {
  fetch();
});
const submitForm = async () => {
  loading.value = true;
  try {
    // event_id, image, title, description, added_by, date_added, date_to_occur
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("added_by", form.added_by);
    formData.append("date_to_occur", form.date_to_occur);

    formData.append("image", form.file);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await axios.put(
      `http://localhost:5000/events/${event_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    loading.value = false;
    toast.success("Events updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update the events");
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
