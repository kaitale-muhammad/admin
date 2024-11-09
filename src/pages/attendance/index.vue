<template>
  <v-card>
    <v-toolbar color="primary">
      <v-toolbar-title>Attendance Tracker</v-toolbar-title>

      <!-- Search bar for ID lookup -->
      <v-text-field
        v-model="searchId"
        label="Search by ID"
        prepend-icon="mdi-magnify"
        @keyup.enter="searchAttendance"
        clearable
      ></v-text-field>
      <v-btn icon @click="searchAttendance">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="d-flex">
      <!-- Year tabs -->
      <v-tabs v-model="tab" color="primary" direction="vertical">
        <v-tab prepend-icon="mdi-calendar" text="2024" value="option-1"></v-tab>
        <v-tab prepend-icon="mdi-calendar" text="2025" value="option-2"></v-tab>
        <v-tab prepend-icon="mdi-calendar" text="2026" value="option-3"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <!-- Month tabs for 2024 -->
        <v-tabs-window-item value="option-1">
          <v-card flat>
            <div class="d-flex">
              <v-tabs
                v-model="monthTab2024"
                color="primary"
                direction="vertical"
              >
                <v-tab
                  v-for="(month, index) in months"
                  :key="index"
                  :value="month"
                >
                  {{ month }}
                </v-tab>
              </v-tabs>
              <v-card-text class="days-container">
                <v-chip
                  v-for="day in daysInMonth2024"
                  :key="day"
                  :color="getChipColor(day, 2024, monthTab2024.value)"
                  class="ma-1 day-chip"
                  outlined
                  small
                >
                  {{ day }}
                </v-chip>
              </v-card-text>
            </div>
          </v-card>
        </v-tabs-window-item>

        <!-- Month tabs for 2025 -->
        <v-tabs-window-item value="option-2">
          <v-card flat>
            <div class="d-flex">
              <v-tabs
                v-model="monthTab2025"
                color="primary"
                direction="vertical"
              >
                <v-tab
                  v-for="(month, index) in months"
                  :key="index"
                  :value="month"
                >
                  {{ month }}
                </v-tab>
              </v-tabs>
              <v-card-text class="days-container">
                <v-chip
                  v-for="day in daysInMonth2025"
                  :key="day"
                  :color="getChipColor(day, 2025, monthTab2025.value)"
                  class="ma-1 day-chip"
                  outlined
                  small
                >
                  {{ day }}
                </v-chip>
              </v-card-text>
            </div>
          </v-card>
        </v-tabs-window-item>

        <!-- Month tabs for 2026 -->
        <v-tabs-window-item value="option-3">
          <v-card flat>
            <div class="d-flex">
              <v-tabs
                v-model="monthTab2026"
                color="primary"
                direction="vertical"
              >
                <v-tab
                  v-for="(month, index) in months"
                  :key="index"
                  :value="month"
                >
                  {{ month }}
                </v-tab>
              </v-tabs>
              <v-card-text class="days-container">
                <v-chip
                  v-for="day in daysInMonth2026"
                  :key="day"
                  :color="getChipColor(day, 2026, monthTab2026.value)"
                  class="ma-1 day-chip"
                  outlined
                  small
                >
                  {{ day }}
                </v-chip>
              </v-card-text>
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

const tab = ref("option-1");
const monthTab2024 = ref("January");
const monthTab2025 = ref("January");
const monthTab2026 = ref("January");
const searchId = ref("");

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

// Selected days for highlighting based on search
const selectedDays = ref({}); // Stores the days with attendance records

// Watchers to trigger search when month is changed
watch(monthTab2024, () => {
  if (tab.value === "option-1") {
    searchAttendance(2024, months.indexOf(monthTab2024.value) + 1);
  }
});
watch(monthTab2025, () => {
  if (tab.value === "option-2") {
    searchAttendance(2025, months.indexOf(monthTab2025.value) + 1);
  }
});
watch(monthTab2026, () => {
  if (tab.value === "option-3") {
    searchAttendance(2026, months.indexOf(monthTab2026.value) + 1);
  }
});

// Function to get the number of days in a month for a given year
const getDaysInMonth = (month, year) => {
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1) return [];
  const date = new Date(year, monthIndex + 1, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

// Computed days for each year and month
const daysInMonth2024 = computed(() =>
  getDaysInMonth(monthTab2024.value, 2024)
);
const daysInMonth2025 = computed(() =>
  getDaysInMonth(monthTab2025.value, 2025)
);
const daysInMonth2026 = computed(() =>
  getDaysInMonth(monthTab2026.value, 2026)
);

// Function to get the chip color based on attendance or specific day (e.g., day "8" highlighted as green)
const getChipColor = (day, year, month) => {
  // Highlight the 8th day in green
  if (day === 8 && year === 2024 && monthTab2024.value === "November") {
    return "red";
  }

  const key = `${year}/${month}/${day}`;
  return selectedDays.value[key] ? "green" : "primary";
};

// Function to search attendance by ID, year, and month
const searchAttendance = async () => {
  const year =
    tab.value === "option-1" ? 2024 : tab.value === "option-2" ? 2025 : 2026;
  const month =
    tab.value === "option-1"
      ? months.indexOf(monthTab2024.value) + 1
      : tab.value === "option-2"
      ? months.indexOf(monthTab2025.value) + 1
      : months.indexOf(monthTab2026.value) + 1;

  selectedDays.value = {}; // Clear selected days before each search
  try {
    const response = await axios.get(
      `http://localhost:5000/attendance/${searchId.value}`,
      { params: { year, month } }
    );

    console.log("Attendance data:", response.data); // Log the response to ensure data is coming through
    if (response.data && response.data.dates) {
      response.data.dates.forEach((dateString) => {
        const date = new Date(dateString); // Convert the date string to a Date object
        const year = date.getFullYear(); // Get the year
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get the month, padded to two digits
        const day = date.getDate().toString().padStart(2, "0"); // Get the day, padded to two digits
        const formattedDate = `${year}/${month}/${day}`; // Format the date as YYYY/MM/DD
        selectedDays.value[formattedDate] = true; // Store in selectedDays
      });
    } else {
      console.error("No attendance records found");
    }
  } catch (error) {
    console.error("Error fetching attendance data", error);
  }
};
</script>

<style>
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
