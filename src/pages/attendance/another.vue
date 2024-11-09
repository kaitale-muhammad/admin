<template>
  <div>
    <div>
      <h2>Attendance Tracker</h2>
    </div>

    <!-- Worker ID Search -->
    <div class="search-bar">
      <input
        v-model="searchWorkerId"
        type="text"
        placeholder="Search Worker ID"
        @input="filterAttendanceByWorkerId"
      />
    </div>

    <!-- Year and Month Tracker -->
    <div class="tracker">
      <!-- Left vertical years list -->
      <div class="years">
        <div
          v-for="year in years"
          :key="year"
          @click="setSelectedYear(year)"
          :class="{ selected: selectedYear === year }"
          class="year"
        >
          {{ year }}
        </div>
      </div>

      <!-- Months Table -->
      <div class="months">
        <div
          v-for="(month, index) in months"
          :key="index"
          @click="setSelectedMonth(month)"
          :class="{ selected: selectedMonth === month }"
          class="month"
        >
          {{ month }}
        </div>
      </div>
    </div>

    <!-- Days for the selected month -->
    <div class="days">
      <div v-if="selectedMonth">
        <h3>{{ selectedMonth }} {{ selectedYear }}</h3>
        <table>
          <thead>
            <tr>
              <th v-for="day in daysInMonth" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="day in daysInMonth"
                :key="day"
                :class="{
                  highlighted: checkIfAttended(day),
                }"
              >
                {{ day }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      years: [2022, 2023, 2024], // Sample years
      months: [
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
      ],
      selectedYear: null,
      selectedMonth: null,
      attendanceData: [], // Array to store fetched attendance data
      filteredAttendanceData: [],
      searchWorkerId: "", // Worker ID search input
    };
  },
  computed: {
    // Calculate days in the selected month
    daysInMonth() {
      if (!this.selectedMonth || !this.selectedYear) return [];
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const daysInMonth = new Date(
        this.selectedYear,
        monthIndex + 1,
        0
      ).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    },
  },
  methods: {
    // Set selected year
    setSelectedYear(year) {
      this.selectedYear = year;
    },

    // Set selected month
    setSelectedMonth(month) {
      this.selectedMonth = month;
      this.fetchAttendanceData(month);
    },

    // Fetch attendance data from backend based on year and month
    async fetchAttendanceData(month) {
      if (!this.selectedYear) return;

      try {
        const response = await fetch(
          `http://localhost:5000/attendances?year=${this.selectedYear}&month=${month}`
        );
        const data = await response.json();

        // Format the dates from backend to "YYYY-MM-DD" format (local date)
        this.attendanceData = data.map((attendance) => {
          // Convert the backend date string (e.g., "2024-11-08 01:06:07") to a Date object
          const date = new Date(attendance.date.replace(" ", "T")); // Convert to valid ISO string
          const formattedDateString = date.toLocaleDateString("en-CA"); // Converts to "YYYY-MM-DD" format
          return { ...attendance, date: formattedDateString };
        });

        console.log("Formatted attendance data:", this.attendanceData);
        this.filterAttendanceByWorkerId(); // Apply filter if worker ID is set
      } catch (error) {
        console.error("Error fetching attendance data", error);
      }
    },

    // Filter attendance data by worker ID
    filterAttendanceByWorkerId() {
      if (this.searchWorkerId) {
        this.filteredAttendanceData = this.attendanceData.filter(
          (attendance) => attendance.worker_id === parseInt(this.searchWorkerId)
        );
      } else {
        this.filteredAttendanceData = this.attendanceData; // Show all if no search is applied
      }

      console.log("Filtered attendance data:", this.filteredAttendanceData);
    },

    // Check if the worker attended on a particular day
    checkIfAttended(day) {
      const dateString = `${this.selectedYear}-${String(
        this.months.indexOf(this.selectedMonth) + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // Check if the filtered attendance data has the matching date
      return this.filteredAttendanceData.some(
        (attendance) => attendance.date === dateString
      );
    },
  },
};
</script>

<style scoped>
.tracker {
  display: flex;
  justify-content: flex-start;
}

.years {
  width: 100px;
  margin-right: 20px;
}

.year {
  cursor: pointer;
  padding: 8px;
  margin-bottom: 5px;
}

.year.selected {
  background-color: lightblue;
}

.months {
  display: flex;
  flex-wrap: wrap;
}

.month {
  cursor: pointer;
  padding: 8px;
  margin: 5px;
  width: 80px;
  text-align: center;
}

.month.selected {
  background-color: lightblue;
}

.days {
  margin-top: 20px;
}

.days table {
  width: 100%;
  border-collapse: collapse;
}

.days td {
  width: 30px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
}

.highlighted {
  background-color: green;
  color: white;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  padding: 8px;
  width: 200px;
  margin-bottom: 20px;
}

.highlighted {
  background-color: green !important;
  color: white;
  border: 1px solid red; /* For debugging purposes */
}
</style>
