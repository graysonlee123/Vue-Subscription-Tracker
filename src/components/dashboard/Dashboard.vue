<template>
  <div id="dashboard">
    <div id="title">
      <h1>Subscriptions</h1>
    </div>
    <div id="main" class="subscriptionsList">
      <div v-if="error">Error, please try again later!</div>
      <spinner v-else-if="loading"></spinner>
      <ul v-else-if="organizedSubscriptions.length > 0">
        <subscription-card
          v-for="(subscription, index) in organizedSubscriptions"
          :key="index"
          :subscription="subscription"
        />
      </ul>
      <div class="empty" v-else>
        Nothing to see here yet... try adding a
        <router-link to="/subscription/new">new subscription</router-link>.
      </div>
    </div>
    <navigation />
  </div>
</template>

<script>
import moment from "moment";

import { clickAway } from "../../mixins/clickAway";
import { EventBus } from "../../EventBus";

import Navigation from "./Navigation";
import SubscriptionCard from "./SubscriptionCard";
import Spinner from "../general/Spinner";

export default {
  mixins: [clickAway],
  components: {
    Navigation,
    SubscriptionCard,
    Spinner,
  },
  data() {
    return {
      loading: true,
      error: false,
      subscriptions: [],
      showSortMenu: false,
      filter: "all",
      showFilterMenu: false,
      flashSubscriptionId: "",
    };
  },
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
  },
  computed: {
    sortMethod() {
      return this.$store.getters.sortingBy;
    },
    sortDirection() {
      return this.$store.getters.sortingDirection;
    },
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
#dashboard {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "title" "main" "nav";
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#navigation {
  grid-area: nav;
  background-color: var(--containerBackground);
}

#title {
  grid-area: title;
  padding: 1.6em 1em;
}

#main {
  grid-area: main;
}

.subscriptionsList {
  margin: 0 1em 1em;
  overflow: auto;
  max-height: 100%;
  // Has to be flex to restrict .subscriptionsList__items's height
}

.empty a {
  color: inherit;
  text-decoration-color: var(--mainAccent);
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (min-width: 767px) {
}
</style>
