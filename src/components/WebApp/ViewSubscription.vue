<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">There was an error. Please try again later.</div>
  <div v-else>
    <div class="colorHeader" :style="{backgroundColor: subscription.color}">
      <div class="colorHeader__options">
        <img
          @click="$router.push('/dashboard')"
          class="colorHeader__close"
          src="@/assets/close-light.svg"
          alt="Close"
        />
        <img class="colorHeader__bell" src="@/assets/bell-light.svg" alt="Notifications" />
        <img class="colorHeader__more" src="@/assets/more-light.svg" alt="More" />
      </div>
      <h3>{{subscription.name}}</h3>
      <h2>${{subscription.price}}</h2>
      <p v-if="subscription.description">{{subscription.description}}</p>
    </div>
    <!-- <ul class="tags">
      <li class="tag">Tag</li>
    </ul>-->
    <div class="col2">
      <div class="displayGroup">
        <label class="displayGroup__label">Billing period</label>
        <p class="displayGroup__text">{{computeBillingPeriod}}</p>
      </div>
      <div class="displayGroup" v-if="subscription.paymentMethod">
        <label class="displayGroup__label">Payment method</label>
        <p class="displayGroup__text">{{subscription.paymentMethod}}</p>
      </div>
    </div>
    <div class="divider"></div>
    <div class="displayGroup">
      <label class="displayGroup__label">Next payment</label>
      <p class="displayGroup__text">{{computeNextPaymentString}}</p>
    </div>
    <div class="col2">
      <div class="displayGroup">
        <label class="displayGroup__label">First payment</label>
        <p class="displayGroup__text">{{computeFirstPaymentString}}</p>
      </div>
      <div class="displayGroup">
        <label class="displayGroup__label">Paid in total</label>
        <p class="displayGroup__text">${{subscription.paidToDate}}</p>
      </div>
    </div>
    <div class="divider" v-if="subscription.note"></div>
    <div class="displayGroup" v-if="subscription.note">
      <label class="displayGroup__label">Note</label>
      <p class="displayGroup__text">{{subscription.note}}</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    subscriptionId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      subscription: null,
    };
  },
  methods: {
    async fetchSubscription() {
      this.loading = true;
      this.subscription = null;

      try {
        const req = await this.$http.get(
          `/api/subscription/${this.subscriptionId}`
        );

        this.subscription = req.data.subscription;
        this.getUpcomingPayments();
      } catch (err) {
        this.error = true;
        this.loading = false;

        this.$store.dispatch("addModal", {
          type: "danger",
          message:
            "There was an error loading that subscription. Please try again later.",
          uuid: uuidv4(),
        });

        console.log(err);
      }
    },
    getUpcomingPayments() {
      const subscription = this.subscription;

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

      this.loading = false;
    },
  },
  created() {
    this.fetchSubscription();
  },
  computed: {
    computeBillingPeriod() {
      const value = this.subscription.duration;
      const interval = this.subscription.interval;

      if (interval > 1) {
        return `Every ${interval} ${value}s`;
      } else if (value === "day") {
        return "Daily";
      } else if (value === "month") {
        return "Monthly";
      } else if (value === "year") {
        return "Yearly";
      } else {
        return "N/A";
      }
    },
    computeFirstPaymentString() {
      return moment.utc(this.subscription.firstPaymentDate).format('MMMM DD, YYYY');
    },
    computeNextPaymentString() {
      return moment.utc(this.subscription.upcomingPayments[0].isoString).format('MMMM DD, YYYY');
    }
  },
};
</script>

<style lang="scss" scoped>
.colorHeader {
  padding: 1em;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  margin-bottom: 2em;

  h3 {
    font-size: 1.6em;
    margin-bottom: 0.4em;
  }

  h2 {
    font-size: 2.8em;
    margin-bottom: 0.4em;
  }

  p {
    margin-top: 1em;
    font-size: 1.3em;
    margin-bottom: 0.6em;
  }

  .colorHeader__options {
    display: flex;
    align-items: center;

    .colorHeader__close,
    .colorHeader__bell,
    .colorHeader__more {
      cursor: pointer;
      padding: 8px;
    }

    .colorHeader__close {
      margin-right: auto;
    }
  }
}

.displayGroup {
  margin-bottom: 2em;

  .displayGroup__label {
    font-size: 0.9em;
    color: var(--textLight);
    margin-bottom: 0.4em;
    display: block;
  }

  .displayGroup__text {
    color: var(--textDark);
    font-size: 1.1em;
  }
}

.divider {
  margin-bottom: 2em;
  height: 3px;
  background-color: var(--bodyBackground);
}

@media screen and (min-width: 768px) {
  .col2 {
    display: flex;

    .displayGroup {
      flex-basis: 50%;
    }
  }
}
</style>