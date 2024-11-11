<template>
  <div class="container">
    <div v-if="!loading">
      <v-sheet class="d-flex" height="54" tile>
        <!-- View Mode Selector -->
        <v-select
          v-model="type"
          :items="types"
          class="ma-2"
          label="View Mode"
          variant="outlined"
          dense
          hide-details
        ></v-select>

        <!-- Weekday Selector -->
        <v-select
          v-model="weekday"
          :items="weekdayOptions"
          item-text="title"
          item-value="value"
          class="ma-2"
          label="Weekdays"
          variant="outlined"
          dense
          hide-details
        ></v-select>
      </v-sheet>

      <!-- Calendar Component -->
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :events="events"
          :type="type"
          :weekdays="weekday"
        ></v-calendar>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import api from "@/axios";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";

const { userAttendanceRecords } = defineProps({
  userAttendanceRecords: {
    type: Object,
    required: true,
  },
});
const loading = ref(true);
const toast = useToast();
const events = ref([]);
const colors = ref([
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1",
]);

// State Variables
const type = ref("month"); // Calendar view mode (e.g., month, week, day)
const types = ["month", "week", "day"]; // Available view modes

// Weekday Options
const weekday = ref([0, 1, 2, 3, 4, 5, 6]); // Default to Sun-Sat
const weekdayOptions = [
  { title: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
  { title: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
  { title: "Mon - Fri", value: [1, 2, 3, 4, 5] },
  { title: "Mon, Wed, Fri", value: [1, 3, 5] },
];
const value = ref([new Date()]);

// Fetch Attendance Data
async function getAttendances() {
  try {
    const res = await api.get(
      `/workersattendance/${userAttendanceRecords.worker_id}`
    );
    loading.value = false;

    // Map attendance records to event format
    events.value = res.data.map((record) => ({
      title: `Attendance - ${record.site_name}`,
      start: new Date(record.date),
      end: new Date(record.date), // Same day for attendance marking
      color: colors.value[Math.floor(Math.random() * colors.value.length)],
      allDay: true,
    }));
  } catch (error) {
    loading.value = false;
    toast.error(JSON.stringify(error));
  }
}

// Lifecycle hook
onMounted(async () => {
  await getAttendances();
});
</script>

<style>
/* .container {
  height: 100vh;
} */
</style>
