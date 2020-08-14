<template>
  <div class="date-wrapper">
    <div
      class="date-text"
      :class="{'date-selected': selectedDate}"
      @click="show = true"
    >{{selectedDateString}}</div>
    <div v-if="show" class="date-picker">
      <div class="header">
        <div class="left buttons" @click="decreaseMonth">
          <i class="fa fa-chevron-left"></i>
        </div>
        <p class="title">{{months[month - 1]}} {{year}}</p>
        <div class="right buttons" @click="increaseMonth">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
      <table>
        <!-- Table day names -->
        <tr class="daysOfWeek">
          <td v-for="(day, index) in days" :key="index">{{day}}</td>
        </tr>
        <!-- Table main rows -->
        <tr v-for="(row, index) in calendarList" :key="index">
          <!-- Table cells -->
          <td
            v-for="(col, index) in row"
            :key="index"
            :style="[col.isToday ? {color: 'var(--mainAccent)'} : {'color': 'var(--textDark)'}]"
          >
            <div
              class="date-button"
              :class="{'selected': selectedDate === col.date, isOtherMonth: col.isOtherMonth !== 0}"
              @click="selectDate(col)"
            >{{col.dayCount}}</div>
          </td>
        </tr>
      </table>
      <div class="footer">
        <input type="button" value="Close" @click="show = false" />
        <input type="button" value="Submit" @click="submitForm" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    dateProp: String,
    color: String,
  },
  data: function () {
    return {
      selectedDate: "",
      day: "",
      month: "",
      year: "",
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
        "Novemeber",
        "Decemeber",
      ],
      days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      calendarList: [],
      show: false,
    };
  },
  methods: {
    loadMonth: function () {
      this.calendarList = [];

      const month = moment.utc(`${this.year}-${this.month}`, "YYYY-M", true);
      const nextMonth = moment.utc(month).add(1, "months"); // Need to create this before modifying "month"

      // Get first day of the month's day of the week
      let offset = month.day();
      let dayCount = 1;

      // Number of days in the month
      const daysInMonth = month.daysInMonth();

      // Build the data for Vue to use
      for (let rows = 0; rows < 6; rows++) {
        const row = [];

        for (let cols = 0; cols < 7; cols++) {
          if (dayCount > daysInMonth) {
            row.push({
              dayCount: nextMonth.date(),
              date: nextMonth.toISOString(),
              isToday: false,
              isOtherMonth: 1,
            });

            nextMonth.add(1, "days");
          } else if (offset == 0) {
            // We want to show today in local time
            const now = moment();
            const isToday =
              now.date() === dayCount &&
              now.month() + 1 === this.month &&
              now.year() === this.year;

            row.push({
              dayCount,
              date: moment
                .utc(`${this.year}-${this.month}-${dayCount}`, "YYYY-M-D", true)
                .toISOString(),
              isToday,
              isOtherMonth: 0,
            });

            dayCount++;
          } else {
            let previousMonth = moment.utc(month).subtract(1, "months");
            previousMonth = previousMonth.date(
              previousMonth.daysInMonth() - offset + 1
            );

            row.push({
              dayCount: previousMonth.date(),
              date: previousMonth.toISOString(),
              isToday: false,
              isOtherMonth: -1,
            });

            previousMonth.subtract(1, "days");
            offset--;
          }
        }

        this.calendarList.push(row);
      }
    },
    decreaseMonth: function () {
      if (this.month > 1) {
        this.month = this.month - 1;
      } else {
        this.year = this.year - 1;
        this.month = 12;
      }
    },
    increaseMonth: function () {
      if (this.month < 12) {
        this.month = this.month + 1;
      } else {
        this.year = this.year + 1;
        this.month = 1;
      }
    },
    selectDate: function (columnData) {
      this.selectedDate = columnData.date;

      if (columnData.isOtherMonth) {
        this.month = moment.utc(columnData.date).month() + 1;
      }
    },
    submitForm: function () {
      this.show = false;
      this.$emit("dateUpdated", this.selectedDate);
    },
  },
  watch: {
    month: function () {
      this.loadMonth();
    },
  },
  created: function () {
    if (this.dateProp) {
      const date = moment.utc(this.dateProp);

      this.year = date.year();

      // ? Month is index based; January is 0...
      // ? so we add 1 to be able to work with iso time strings better
      this.month = date.month() + 1;
      this.day = date.date();

      this.selectedDate = date.toISOString();
    } else {
      const currentDate = moment();

      this.year = currentDate.year();
      this.month = currentDate.month() + 1;
      this.day = currentDate.date();
    }
  },
  computed: {
    selectedDateString: function () {
      return this.selectedDate
        ? `${moment.utc(this.selectedDate).format("MMMM DD, YYYY")}`
        : "Select a date...";
    },
  },
};

// Should populate date if a prop is passed, or
// should allow to start new based on current date
</script>

<style lang="scss" scoped>
.date-wrapper {
  position: relative;

  .date-text {
    $height: 42px;

    height: $height;
    width: 100%;
    border: 2px solid var(--textLight);
    border-radius: $height / 2;
    padding: 0 1.4em;
    font-size: 0.8em;
    color: var(--textDark);
    line-height: $height - 4px;
    cursor: pointer;
  }
}

.date-picker {
  position: absolute;
  z-index: 2;
  bottom: 60px;
  left: 0;
  width: 220px;
  font-size: 0.6rem;
  padding: 1em;
  background-color: var(--containerBackground);
  border-radius: 5px;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.2);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    color: var(--textDark);

    .title {
      flex-grow: 1;
      text-align: center;
      font-weight: bold;
      font-size: 0.9em;
    }

    .buttons {
      cursor: pointer;
      padding: 1em;
    }
  }

  table {
    width: 100%;
    text-align: center;
    color: var(--textDark);
    font-weight: bold;

    .daysOfWeek {
      color: var(--textLight);
    }

    tr {
      td {
        height: 30px;
        vertical-align: middle;

        div {
          width: 24px;
          height: 24px;
          margin: auto;
          border-radius: 50%;
          cursor: pointer;
          line-height: 24px;

          &:hover,
          &.selected {
            background-color: rgba(0, 0, 0, 0.07);
          }

          &.isOtherMonth {
            color: var(--textLight);
          }
        }

        &.current-month {
          color: #fff;
        }
      }
    }
  }
}

.footer {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1em;
  padding-top: 1em;

  input {
    border: none;
    color: #fff;
    background-color: #666;
    padding: 0.8em 1.4em;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
}
</style>