<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="Add Client Info"
          ></v-btn>
        </template>
        <!-- id, name, contact, email, location, man_power, gun, baton, touch, radio_call, occurance_book, date_added -->

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <!-- <v-toolbar title="Add Client Info"></v-toolbar> -->

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <input
                type="text"
                v-model="form.name"
                placeholder="Name"
                name="by"
                id="by"
              /><br />
              <input
                type="text"
                v-model="form.contact"
                placeholder="Contact"
                name="by"
                id="by"
              /><br /><input
                type="email"
                v-model="form.email"
                placeholder="Email"
                name="by"
                id="by"
              /><br />
              <input
                type="text"
                v-model="form.site_name"
                placeholder="Site Name"
                name="by"
                id="by"
              />
              <input
                type="text"
                v-model="form.location"
                placeholder="Location"
                name="by"
                id="by"
              />
              <div class="requirements">
                <!-- man_power, gun,dog, baton, touch, radio_call, occurance_book, -->
                <input
                  type="number"
                  v-model="form.man_power"
                  placeholder="man power"
                  name="man_power"
                  id="by"
                  autocomplete="no"
                /><input
                  type="number"
                  v-model="form.gun"
                  placeholder="Gun"
                  name="by"
                  id="by"
                  autocomplete="no"
                /><input
                  type="number"
                  v-model="form.dog"
                  placeholder="Dog"
                  name="by"
                  id="by"
                  autocomplete="no"
                /><input
                  type="number"
                  v-model="form.baton"
                  placeholder="Baton"
                  name="by"
                  id="by"
                  autocomplete="no"
                /><input
                  type="number"
                  v-model="form.touch"
                  placeholder="Touch"
                  name="by"
                  id="by"
                  autocomplete="no"
                /><input
                  type="number"
                  v-model="form.radio_call"
                  placeholder="Radio call"
                  name="by"
                  id="by"
                  autocomplete="no"
                />
              </div>
              <input
                type="text"
                v-model="form.others"
                placeholder="Others"
                name="by"
                id="by"
              />
              <v-btn
                class="mt-2"
                type="submit"
                color="primary"
                @click="isActive.value = false"
                block
                >Add</v-btn
              >
            </v-form>
            <!-- id, name, contact, email, location, man_power, gun, baton, touch, radio_call, occurance_book, date_added -->
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
    </div>
    <hr />
  </div>
</template>

<style scoped>
.box {
  padding: 10px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: end;
}

input {
  width: 100%;
  padding: 7px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}
.requirements input {
  width: 160px;
}
.requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: space-between;
}
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}

.form {
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
// const loading = ref(true);
// let data = ref(undefined);
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const editing = false;

const form = reactive({
  name: "",
  contact: "",
  email: "",
  site_name: "",
  location: "",
  man_power: "",
  gun: "",
  dog: "",
  baton: "",
  touch: "",
  radio_call: "",
  others: "",
});

const submitForm = async () => {
  loading.value = true;
  try {
    await axios.post(`http://localhost:5000/clients`, form);
    loading.value = false;
    toast.success("Client added successfully!");
    // isActive.value = false;
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to add the client");
  }
};
</script>
