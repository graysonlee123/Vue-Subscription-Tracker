<template>
  <div
    class="inputGroup"
    :class="{'inputGroup--error': errors.length}"
    ref="datePicker"
    data-name="showDatePicker"
  >
    <label for class="inputGroup__label">
      {{label}}
      <span class="inputGroup__label--error" v-if="errors.length">{{ errors[0].msg }}</span>
    </label>
    <div
      class="inputGroup__input"
      :value="value"
      :class="{'inputGroup__input--empty': !this.value}"
      @input="$emit('input', $event.target.value)"
      @click="showDatePicker = !showDatePicker"
    >{{selectedDateString}}</div>
    <div v-if="showDatePicker" class="datePicker">
      <div class="datePicker__header">
        <div class="left datePicker__navButtons" @click="decreaseMonth">
          <i class="fa fa-chevron-left"></i>
        </div>
        <p class="datePicker__currentMonth">{{months[month - 1]}} {{year}}</p>
        <div class="right datePicker__navButtons" @click="increaseMonth">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
      <table>
        <!-- Table day names -->
        <tr class="datePicker__daysOfWeek">
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
              :class="{'selected': value === col.date, isOtherMonth: col.isOtherMonth !== 0}"
              @click="selectDate(col)"
            >{{col.dayCount}}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { clickAway } from "../../../mixins/clickAway";

export default {
  mixins: [clickAway],
  props: {
    value: {
      required: true,
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    errors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
      showDatePicker: false,
    };
  },
  methods: {
    loadMonth() {
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
    decreaseMonth() {
      if (this.month > 1) {
        this.month = this.month - 1;
      } else {
        this.year = this.year - 1;
        this.month = 12;
      }
    },
    increaseMonth() {
      if (this.month < 12) {
        this.month = this.month + 1;
      } else {
        this.year = this.year + 1;
        this.month = 1;
      }
    },
    selectDate(columnData) {
      if (columnData.isOtherMonth) {
        this.month = moment.utc(columnData.date).month() + 1;
      }
      this.$emit("handle-change", columnData.date);
    },
  },
  created() {
    if (this.dateProp) {
      const date = moment.utc(this.dateProp);

      this.year = date.year();

      // ? Month is index based; January is 0...
      // ? so we add 1 to be able to work with iso time strings better
      this.month = date.month() + 1;
      this.day = date.date();
    } else {
      const currentDate = moment();

      this.year = currentDate.year();
      this.month = currentDate.month() + 1;
      this.day = currentDate.date();
    }
  },
  watch: {
    month() {
      this.loadMonth();
    },
  },
  computed: {
    selectedDateString() {
      return this.value
        ? `${moment.utc(this.value).format("MMMM DD, YYYY")}`
        : "Select a date...";
    },
  },
};
</script>

<style lang="scss" scoped>
.inputGroup {
  margin-bottom: 1.6rem;
  position: relative;

  .inputGroup__label {
    display: block;
    margin-bottom: 0.8em;
    color: var(--textLight);
    font-size: 0.8em;
    font-weight: bold;
    padding-left: 1.6em;

    .inputGroup__label--error {
      color: var(--danger);
    }
  }

  .inputGroup__input {
    width: 100%;
    border: 2px solid var(--textLight);
    font-size: 0.8em;
    background-color: transparent;
    color: var(--textDark);
    border-radius: 21px;
    height: 42px;
    line-height: 42px;
    padding: 0 1.4em;

    &.inputGroup__input--empty {
      color:var(--textLight);
    }
  }
}

.inputGroup.inputGroup--error {
  .inputGroup__input {
    border-color: var(--danger);
  }
}

.datePicker {
  position: absolute;
  z-index: 2;
  top: 60px;
  left: 0;
  width: 220px;
  font-size: 0.6rem;
  padding: 1em;
  background-color: var(--containerBackground);
  border-radius: 5px;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.2);
  user-select: none;

  .datePicker__header {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    color: var(--textDark);

    .datePicker__currentMonth {
      flex-grow: 1;
      text-align: center;
      font-weight: bold;
      font-size: 0.9em;
    }

    .datePicker__navButtons {
      cursor: pointer;
      padding: 1em;
    }
  }

  table {
    width: 100%;
    text-align: center;
    color: var(--textDark);
    font-weight: bold;

    .datePicker__daysOfWeek {
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
</style>