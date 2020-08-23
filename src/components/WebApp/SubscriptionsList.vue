<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error, please try again later!</div>
  <div class="subscriptionsList" v-else>
    <div class="subscriptionsList__header">
      <h1>Subscriptions</h1>
      <p>
        {{organizedSubscriptions.length}} total
        <span v-if="filter !== 'all'">(filtered)</span>
      </p>
      <div
        class="filter subscriptionsList__button subscriptionsList__button--filter"
        @click="handleDisplayFilterMenu()"
        ref="filterMenu"
        data-name="showFilterMenu"
      >
        <span>
          <span class="btn__text">Filter</span>
          <i class="fa fa-filter"></i>
        </span>
        <ul class="optionsList" v-if="showFilterMenu">
          <li @click="filter = 'all'" :class="{bold: filter === 'all'}">Show All</li>
          <li @click="filter = 'week'" :class="{bold: filter === 'week'}">In a week</li>
          <li @click="filter = 'month'" :class="{bold: filter === 'month'}">In a month</li>
          <li @click="filter = 'year'" :class="{bold: filter === 'year'}">In a year</li>
        </ul>
      </div>
      <div
        class="sort subscriptionsList__button subscriptionsList__button--sort"
        @click="handleDisplaySortMenu()"
        ref="sortMenu"
        data-name="showSortMenu"
      >
        <span>
          <span class="btn__text">Sort</span>
          <i class="fa fa-sort"></i>
        </span>
        <ul class="optionsList" v-if="showSortMenu">
          <li
            @click="sortMethod = 'nextPayment'"
            :class="{bold: filter === 'nextPayment'}"
          >Next Payment</li>
          <li @click="sortMethod = 'name'" :class="{bold: filter === 'name'}">Name</li>
          <li @click="sortMethod = 'price'" :class="{bold: filter === 'price'}">Price</li>
          <li
            @click="sortMethod = 'paidToDate'"
            :class="{bold: filter === 'paidToDate'}"
          >Paid To Date</li>
          <li
            @click="sortMethod = 'paymentMethod'"
            :class="{bold: filter === 'paymentMethod'}"
          >Payment Method</li>
          <li @click="sortMethod = 'duration'" :class="{bold: filter === 'duration'}">Billing Period</li>
          <li
            @click="sortMethod = 'firstPayment'"
            :class="{bold: filter === 'firstPayment'}"
          >First Payment</li>
        </ul>
      </div>
      <router-link
        to="/dashboard/subscription/new"
        tag="div"
        class="subscriptionsList__button subscriptionsList__button--add"
      >
        <span class="btn__text">Add</span>
        <i class="fa fa-plus"></i>
      </router-link>
      <!-- Add back in later when things can go here
        <div class="button button__ellipsis">
          <i class="fas fa-ellipsis-h"></i>
      </div>-->
    </div>
    <div class="subscriptionsList__labels">
      <div class="color"></div>
      <div
        class="name"
        :class="{selected: sortMethod === 'name'}"
        @click="sortMethod === 'name' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'name'"
      >
        Name
        <img
          v-if="sortMethod === 'name'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="price"
        :class="{selected: sortMethod === 'price'}"
        @click="sortMethod === 'price' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'price'"
      >
        Price
        <img
          v-if="sortMethod === 'price'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="paidToDate"
        :class="{selected: sortMethod === 'paidToDate'}"
        @click="sortMethod === 'paidToDate' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'paidToDate'"
      >
        Paid To Date
        <img
          v-if="sortMethod === 'paidToDate'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="billingPeriod"
        :class="{selected: sortMethod === 'billingPeriod'}"
        @click="sortMethod === 'billingPeriod' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'billingPeriod'"
      >
        Billing Period
        <img
          v-if="sortMethod === 'billingPeriod'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="paymentMethod"
        :class="{selected: sortMethod === 'paymentMethod'}"
        @click="sortMethod === 'paymentMethod' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'paymentMethod'"
      >
        Payment Method
        <img
          v-if="sortMethod === 'paymentMethod'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="tags"
        :class="{selected: sortMethod === 'tags'}"
        @click="sortMethod === 'tags' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'tags'"
      >
        Tags
        <img
          v-if="sortMethod === 'tags'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="firstPayment"
        :class="{selected: sortMethod === 'firstPayment'}"
        @click="sortMethod === 'firstPayment' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'firstPayment'"
      >
        First Payment
        <img
          v-if="sortMethod === 'firstPayment'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div
        class="nextPayment"
        :class="{selected: sortMethod === 'nextPayment'}"
        @click="sortMethod === 'nextPayment' ? sortDirection === 1 ? sortDirection = -1 : sortDirection = 1 : sortMethod = 'nextPayment'"
      >
        Next Payment
        <img
          v-if="sortMethod === 'nextPayment'"
          src="@/assets/sort-arrow.svg"
          alt="Sort direction"
          class="sortIcon"
          :class="{'sortIcon--flip': sortDirection === 1}"
        />
      </div>
      <div class="options"></div>
    </div>
    <ul class="subscriptionsList__items" v-if="subscriptions.length > 0">
      <subscription-list-item
        v-for="(subscription, index) in organizedSubscriptions"
        :key="index"
        :subscription="subscription"
      />
    </ul>
    <div class="empty" v-else>
      Nothing to see here... try adding a
      <router-link to="/dashboard/subscription">new subscription</router-link>.
    </div>
  </div>
</template>

<script>
import SubscriptionListItem from "./SubscriptionListItem";
import { EventBus } from "../../EventBus";
import moment from "moment";
import { clickAway } from "../../mixins/clickAway";

export default {
  components: {
    SubscriptionListItem,
  },
  data() {
    return {
      loading: true,
      error: false,
      subscriptions: [],
      sortDirection: -1,
      sortMethod: "nextPayment",
      showSortMenu: false,
      filter: "all",
      showFilterMenu: false,
      flashSubscriptionId: "",
    };
  },
  watch: {
    sortMethod() {
      this.showSortMenu = false;
    },
    filter() {
      this.showFilterMenu = false;
    },
  },
  mixins: [clickAway],
  methods: {
    async fetchSubscriptions() {
      try {
        this.loading = true;
        this.subscriptions = [];

        const res = await this.$http.get("/api/subscription");
        const subscriptions = res.data.subscriptions;

        if (!subscriptions) {
          this.loading = false;
          return;
        }

        subscriptions.forEach((subscription, index) => {
          subscriptions[index].price = subscription.price.toFixed(2);

          this.getUpcomingPayments(subscription);
        });

        this.subscriptions.push(...subscriptions);
        this.loading = false;
      } catch (err) {
        this.error = true;
        console.log(err);
      }
    },
    getUpcomingPayments(subscription) {
      // Should remain an arrow function to remain this binding
      const pushDateToUpcoming = (date) => {
        subscription.upcomingPayments.push({
          isoString: date.utc().toISOString(),
        });
      };

      // Set initial values in subscription data
      subscription.upcomingPayments = [];
      subscription.paidToDate = 0;

      // Logic Begins
      // Copy first payment date to new const
      const date = moment.utc(subscription.firstPaymentDate);

      // Remove time of day from the equation
      const now = moment
        .utc()
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0);

      // If we're past the first payment date, find the next payment date
      if (moment.utc().isAfter(date)) {
        // "fast forward" until we find the next payment date
        while (now.isAfter(date)) {
          date.add(subscription.interval, `${subscription.duration}s`);
          subscription.paidToDate += parseFloat(subscription.price);
        }
      }

      // Fix the decimals on paid to date
      subscription.paidToDate = subscription.paidToDate.toFixed(2);

      // Get the next payment date
      pushDateToUpcoming(date);

      // And get 7 more
      for (let i = 0; i < 7; i++) {
        date.add(subscription.interval, `${subscription.duration}s`);
        pushDateToUpcoming(date);
      }
    },
    switchSortDirection() {
      this.sortDirection === -1
        ? (this.sortDirection = 1)
        : (this.sortDirection = -1);
    },
    handleDisplaySortMenu(bool) {
      if (typeof bool === "boolean") {
        this.showSortMenu = bool;
      } else {
        this.showSortMenu
          ? (this.showSortMenu = false)
          : (this.showSortMenu = true);
      }
    },
    handleDisplayFilterMenu(bool) {
      if (typeof bool === "boolean") {
        this.showFilterMenu = bool;
      } else {
        this.showFilterMenu
          ? (this.showFilterMenu = false)
          : (this.showFilterMenu = true);
      }
    },
  },
  computed: {
    organizedSubscriptions() {
      let organizedSubs = this.subscriptions;

      // First, filter the subscriptions if necessary
      // ? Filter creates a new array

      // TODO: Make this more DRY
      switch (this.filter) {
        default:
        case "all": {
          organizedSubs = organizedSubs.filter((sub) => sub);
          break;
        }
        case "week": {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString
            );
            const weekFromNow = moment.utc().add(1, "weeks");

            if (nextPaymentDate.isBefore(weekFromNow)) {
              return true;
            }
          });
          break;
        }
        case "month": {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString
            );
            const monthFromNow = moment.utc().add(1, "months");

            if (nextPaymentDate.isBefore(monthFromNow)) {
              return true;
            }
          });
          break;
        }
        case "year": {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString
            );
            const yearFromNow = moment.utc().add(1, "years");

            if (nextPaymentDate.isBefore(yearFromNow)) {
              return true;
            }
          });
          break;
        }
      }

      // Then sort them
      switch (this.sortMethod) {
        case "name":
        case "duration":
        case "paymentMethod": {
          organizedSubs.sort((a, b) => {
            const x = a[this.sortMethod].toLowerCase();
            const y = b[this.sortMethod].toLowerCase();

            if (x > y) return -1;
            if (x < y) return 1;
            return 0;
          });
          break;
        }
        case "price":
        case "paidToDate": {
          organizedSubs.sort((a, b) => a[this.sortMethod] - b[this.sortMethod]);
          break;
        }
        case "firstPayment": {
          organizedSubs.sort((a, b) => {
            const x = moment.utc(a.firstPaymentDate).valueOf();
            const y = moment.utc(b.firstPaymentDate).valueOf();

            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          });
          break;
        }
        default:
        case "nextPayment": {
          organizedSubs.sort((a, b) => {
            const x = moment.utc(a.upcomingPayments[0].isoString).valueOf();
            const y = moment.utc(b.upcomingPayments[0].isoString).valueOf();

            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          });
          break;
        }
      }

      if (this.sortDirection === 1) {
        organizedSubs.reverse();
      }

      return organizedSubs;
    },
    sortMethodDisplayName() {
      switch (this.sortMethod) {
        case "name": {
          return "Name";
          break;
        }
        case "duration": {
          return "Billing Period";
          break;
        }
        case "paymentMethod": {
          return "Payment Method";
          break;
        }
        case "price": {
          return "Price";
          break;
        }
        case "paidToDate": {
          return "Paid To Date";
          break;
        }
        case "firstPayment": {
          return "First Payment";
          break;
        }
        case "nextPayment": {
          return "Next Payment";
          break;
        }
      }
    },
  },
  created() {
    this.fetchSubscriptions();

    EventBus.$on("refreshSubscriptions", () => {
      this.fetchSubscriptions();
    });
  },
};
</script>

<style lang="scss">
.subscriptionsList {
  margin: 2em;
  overflow: hidden;
  max-height: 100%;
  // Has to be flex to restrict .subscriptionsList__items's height
  display: flex;
  flex-flow: column;

  .subscriptionsList__header {
    display: flex;
    align-items: baseline;
    margin-bottom: 2em;
    user-select: none;

    h1 {
      margin-right: 0.8em;
    }
  }

  .subscriptionsList__labels {
    $height: 62px;

    display: flex;
    padding: 0 0 1em;
    font-size: 80%;
    font-weight: bold;
    user-select: none;

    .sortIcon {
      display: none;
      width: 10px;
      height: auto;
    }

    // These should match the corresponding items in the subscription list item scss

    .color {
      flex-basis: $height;
      text-align: center;
      flex-shrink: 0;
    }

    .name {
      flex-basis: 140px;
    }

    .price {
      flex-basis: 100px;
      font-weight: bold;
    }

    .paidToDate {
      flex-basis: 120px;
    }

    .billingPeriod {
      flex-basis: 140px;
    }

    .paymentMethod {
      flex-basis: 150px;
    }

    .tags {
      flex-basis: 100px;
      flex-grow: 1;
    }

    .firstPayment {
      flex-basis: 200px;
    }

    .nextPayment {
      flex-basis: 260px;
    }

    .options {
      flex-basis: $height;
      text-align: center;
    }

    .selected {
      font-weight: 800;

      .sortIcon {
        display: inline;

        &.sortIcon--flip {
          transform: rotate(180deg);
        }
      }
    }
  }

  .subscriptionsList__items {
    overflow-y: auto;
  }

  .subscriptionsList__button {
    $height: 38px;

    height: $height;
    background-color: var(--containerBackground);
    line-height: $height;
    border-radius: var(--borderRadius);
    padding-left: 2em;
    padding-right: 2em;
    cursor: pointer;
    position: relative;

    &.subscriptionsList__button--filter {
      margin-left: auto;
      margin-right: 1em;
    }

    &.subscriptionsList__button--add {
      background-color: var(--mainAccent);
      color: #fff;
    }

    &.subscriptionsList__button--sort {
      display: none;
    }
  }
}

.optionsList {
  position: absolute;
  top: 48px;
  left: 0;
  background-color: var(--containerBackground);
  box-shadow: 0 8px 4px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 11;

  li {
    padding: 1em 2em;
    cursor: pointer;
    line-height: 16px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.07);
    }

    &.bold {
      font-weight: bold;
    }
  }
}

@media screen and (max-width: 1200px) {
  .subscriptionsList {
    overflow-y: auto;

    .subscriptionsList__header {
      .subscriptionsList__button--sort {
        display: block;
        margin-right: 1em;
      }
    }

    .subscriptionsList__labels {
      display: none;
    }

    .subscriptionsList__items {
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .subscriptionsList {
    margin: 1em;

    .subscriptionsList__header {
      flex-wrap: wrap;

      .subscriptionsList__button--filter {
        margin-left: 0;
      }

      > p {
        margin-right: auto;
      }
    }
  }
}
</style>
