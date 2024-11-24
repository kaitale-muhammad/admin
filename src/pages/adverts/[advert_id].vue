<template>
  <div class="main">
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="6">
          <div class="content">
            <VCard>
              <div class="top">
                <v-btn
                  class="text-none me-2"
                  @click="back"
                  height="48"
                  icon
                  slim
                >
                  <v-avatar color="info">
                    <v-icon icon="mdi-arrow-left-thick" color="white"></v-icon>
                  </v-avatar>
                </v-btn>

                <!-- chevron-left -->
              </div>

              <img
                :src="`https://backendpsl.up.railway.app/uploads/` + form.file"
                width="100%"
                height="200"
              /><br /><br />

              {{ form.description }}<br /><br />
              <hr />
              <b>By:</b> {{ form.added_by }} <br />
            </VCard>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <VCard
            width="400px"
            class="card"
            align-center
            elevation="true"
            border="red"
          >
            <VForm @submit.prevent="submitForm">
              <!-- {{ notes_id }} -->

              <div class="image">
                <VAvatar
                  :image="
                    'https://backendpsl.up.railway.app/uploads/' + form.file
                  "
                ></VAvatar
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
              <input
                type="text"
                v-model="form.added_by"
                placeholder="Added By"
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const form = reactive({
  file: "",
  description: "",
  added_by: "",
});

const back = () => {
  router.go(-1);
};

const loading = ref(false);
const route = useRoute();
const advert_id = route.params.advert_id;
const toast = useToast();
async function fetch() {
  try {
    const response = await api.get(`/adverts/${advert_id}`);
    var data = response.data;

    form.file = data.image || "";
    form.description = data.description || "";
    form.added_by = data.added_by || "";
  } catch (err) {
    console.error(err);
    toast.error("Failed to load Adverts");
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
    // advert_id, image, description, added_by, date_added
    const formData = new FormData();

    formData.append("description", form.description);
    formData.append("added_by", form.added_by);

    formData.append("image", form.file);

    if (filedata.value) {
      formData.append("file", filedata.value);
    }

    const response = await api.put(`/adverts/${advert_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    loading.value = false;
    toast.success("News updated successfully!");
    fetch();
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to update the news");
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
