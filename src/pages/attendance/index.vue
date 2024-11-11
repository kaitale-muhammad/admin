<template>
  <v-card>
    <v-toolbar color="primary">
      <v-toolbar-title>Attendance Tracker</v-toolbar-title>

      <!-- Search bar for ID lookup -->
      <v-text-field
        v-model="searchId"
        label="Search by ID"
        prepend-icon="mdi-magnify"
        @keyup.enter="
          searchAttendance(parseInt(tab), months.indexOf(monthTab) + 1)
        "
        clearable
      ></v-text-field>
      <v-btn
        icon
        @click="searchAttendance(parseInt(tab), months.indexOf(monthTab) + 1)"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="d-flex">
      <!-- Year tabs -->
      <v-tabs v-model="tab" color="primary" direction="vertical">
        <v-tab v-for="year in years" :key="year" :value="year">
          {{ year }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="year in years" :key="year" :value="year">
          <v-card flat>
            <div class="d-flex">
              <v-tabs v-model="monthTab" color="primary" direction="vertical">
                <v-tab
                  v-for="(month, index) in months"
                  :key="index"
                  :value="month"
                >
                  {{ month }}
                </v-tab>
              </v-tabs>

              <v-data-table
                :items="items"
                :items-per-page="6"
                :headers="headers"
                hover
              >
                <!-- id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added -->
                <!-- <template v-for="h in headers" :key="h" #header.id>
                  <div class="text-start">{{ h.text }}</div>
                </template> -->
                <template v-for="h in headers" :key="h.value">
                  <div class="text-start">{{ h.text }}</div>
                </template>
                <!-- id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added -->
              </v-data-table>
              <!-- <v-card-text class="days-container">
                <v-chip
                  v-for="day in daysInMonthYear"
                  :key="day"
                  :color="getChipColor(day, parseInt(tab), monthTab)"
                  class="ma-1 day-chip"
                  outlined
                  small
                >
                  {{ day }}
                </v-chip>
              </v-card-text> -->
            </div>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";

const monthTab = ref("January");
const searchId = ref("");
const currentYear = new Date().getFullYear();
const tab = ref(`${new Date().getFullYear()}`);
const years = ref([]);
for (let i = 2020; i <= currentYear; i++) {
  years.value.push(i);
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const selectedDays = ref({});
const search = ref("");
const items = ref([]);
//id, name, contact, email, location, man_power, gun, dog, baton, touch, radio_call, date_added

// Get the number of days in a month
const getDaysInMonth = (month, year) => {
  const monthIndex = months.indexOf(month);

  if (monthIndex === -1) return [];
  const date = new Date(year, monthIndex + 1, 0);
  console.log(date);

  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

console.log("tab", tab);

const daysInMonthYear = computed(() =>
  getDaysInMonth(monthTab.value, Number(tab.value))
);

const days = daysInMonthYear.value.map((m) => {
  return { text: m, value: m };
});
const headers = ref([
  { text: "ID", value: "id" },
  { text: "Name", value: "name" },
  ...days,
]);

// Watchers to trigger search when year or month changes
watch([tab, monthTab], ([newYear, newMonth]) => {
  searchAttendance(parseInt(newYear), months.indexOf(newMonth) + 1);
});

// Get chip color based on attendance
const getChipColor = (day, year, month) => {
  const formattedDate = `${year}/${(months.indexOf(month) + 1)
    .toString()
    .padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
  return selectedDays.value[formattedDate] ? "green" : "grey";
};

// Search attendance by ID, year, and month
const searchAttendance = async (year, month) => {
  selectedDays.value = {}; // Clear selected days before each search
  try {
    const response = await axios.get(
      `http://localhost:5000/attendance/${searchId.value}`,
      { params: { year, month } }
    );
    if (response.data && response.data.dates) {
      response.data.dates.forEach((dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
        selectedDays.value[formattedDate] = true;
      });
    } else {
      console.error("No attendance records found");
    }
  } catch (error) {
    console.error("Error fetching attendance data", error);
  }
};
</script>

<style scoped>
.v-chip {
  border-radius: 50%;
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.days-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 300px;
  width: 100%;
  gap: 4px;
  overflow: hidden;
}
.day-chip {
  cursor: pointer;
}
</style>
