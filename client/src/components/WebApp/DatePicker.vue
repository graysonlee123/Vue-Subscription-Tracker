<template>
  <div class="date-wrapper">
    <div
      class="date-text"
      :class="{'date-selected': selectedDate}"
      @click="show = true"
    >{{inputText || selectedDate }}</div>
    <div v-if="show" class="date-picker">
      <div class="header">
        <div class="left buttons" @click="decreaseMonth">
          <i class="fa fa-chevron-left"></i>
        </div>
        <p class="title">{{months[month]}} {{year}}</p>
        <div class="right buttons" @click="increaseMonth">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
      <table>
        <!-- Table day names -->
        <tr class="days-of-week">
          <td v-for="(day, index) in days" :key="index">{{day}}</td>
        </tr>
        <!-- Table main rows -->
        <tr v-for="(row, index) in calendarList" :key="index">
          <!-- Table cells -->
          <td
            v-for="(col, index) in row"
            :key="index"
            :class="{'current-month': col.datem}"
            :style="[col.isToday ? {color: 'var(--mainAccent)'} : {'color': 'var(--textLight)'}]"
          >
            <div
              class="date-button"
              :class="{'selected': selectedDate === col.date}"
              @click="selectDate(col.date)"
            >{{col.dayCount || '.'}}</div>
          </td>
        </tr>
      </table>
      <div class="footer">
        <input type="button" value="Close" @click="show = false" />
        <input type="button" value="Submit" @click="submitForm" :style="{backgroundColor: color}" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: String,
    color: String,
  },
  data: function () {
    return {
      inputText: "Select a date...",
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

      // Get first day of the month's day of the week
      let offset = new Date(this.year, this.month, 1).getDay();
      let dayCount = 1;

      // Number of days in the month
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

      // Build the data for Vue to use
      for (let rows = 0; rows < 6; rows++) {
        const row = [];

        for (let cols = 0; cols < 7; cols++) {
          if (dayCount > daysInMonth) {
            row.push({});
          } else if (offset == 0) {
            const now = new Date(Date.now());
            const isToday =
              now.getDate() === dayCount &&
              now.getMonth() === this.month &&
              now.getFullYear() === this.year;

            row.push({
              dayCount,
              date: this.parseDate(this.year, this.month, dayCount),
              isToday,
            });

            dayCount++;
          } else {
            row.push({});
            offset--;
          }
        }

        this.calendarList.push(row);
      }
    },
    decreaseMonth: function () {
      if (this.month > 0) {
        this.month = this.month - 1;
      } else {
        this.year = this.year - 1;
        this.month = 11;
      }
    },
    increaseMonth: function () {
      if (this.month < 11) {
        this.month = this.month + 1;
      } else {
        this.year = this.year + 1;
        this.month = 0;
      }
    },
    selectDate: function (date) {
      this.selectedDate = date;
    },
    submitForm: function () {
      this.inputText = this.selectedDate;
      this.show = false;

      this.$emit("dateUpdated", this.selectedDate);
    },
    parseDate: function (year, month, day) {
      const monthParse = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
      const dayParse = day < 10 ? `0${day}` : `${day}`;

      return `${year}-${monthParse}-${dayParse}`;
    },
    setDate: function () {
      this.selectedDate = this.parseDate(this.year, this.month, this.day);
    },
  },
  watch: {
    month: function () {
      this.loadMonth();
    },
    show: function (val) {
      if (val) {
        this.setDate;
      }
    },
  },
  created: function () {
    if (this.date) {
      const newDate = new Date(this.date);

      this.year = newDate.getFullYear();
      this.month = newDate.getMonth();
      this.day = newDate.getDate();

      this.setDate();
      this.inputText = this.selectedDate;
    } else {
      const currentDate = new Date(Date.now());

      this.year = currentDate.getFullYear();
      this.month = currentDate.getMonth();
      this.day = currentDate.getDate();
    }
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

    .title {
      flex-grow: 1;
      text-align: center;
      color: var(--textLight);
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