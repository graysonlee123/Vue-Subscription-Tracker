<template>
  <spinner v-if="loading"></spinner>
  <div v-else-if="error">There was an error. Please try again later.</div>
  <div v-else>
    <div class="colorHeader" :style="{backgroundColor: subscription.color}">
      <div class="colorHeader__options">
        <svg
          @click="$router.push('/dashboard')"
          class="colorHeader__close"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L13 13" stroke="white" stroke-width="2" stroke-linecap="round" />
          <path d="M1 13L13 0.999999" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>

        <svg
          class="colorHeader__bell"
          @click="handleNotification"
          width="17"
          height="20"
          viewBox="0 0 17 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.875 1.375C6.875 0.614167 7.48917 0 8.25 0C9.01083 0 9.625 0.614167 9.625 1.375V2.4475C12.5033 3.07083 14.6667 5.6375 14.6667 8.70833V14.2083L16.5 16.0417V16.9583H0V16.0417L1.83333 14.2083V8.70833C1.83333 5.6375 3.99667 3.07083 6.875 2.4475V1.375ZM8.25001 4.125C10.78 4.125 12.8333 6.17833 12.8333 8.70833V15.125H3.66667V8.70833C3.66667 6.17833 5.72001 4.125 8.25001 4.125ZM6.42585 17.8842C6.42585 18.8925 7.24169 19.7083 8.25002 19.7083C9.25836 19.7083 10.0742 18.8925 10.0742 17.8842H6.42585Z"
            fill="white"
          />
        </svg>

        <div
          class="colorHeader__more"
          ref="subscriptionOptionsMenu"
          data-name="showOptions"
          @click="showOptions = !showOptions"
        >
          <svg
            class="colorHeader__more"
            width="4"
            height="15"
            viewBox="0 0 4 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 3.75C3.1 3.75 4 2.90625 4 1.875C4 0.84375 3.1 0 2 0C0.9 0 0 0.84375 0 1.875C0 2.90625 0.9 3.75 2 3.75ZM2 5.625C0.9 5.625 0 6.46875 0 7.5C0 8.53125 0.9 9.375 2 9.375C3.1 9.375 4 8.53125 4 7.5C4 6.46875 3.1 5.625 2 5.625ZM0 13.125C0 12.0938 0.9 11.25 2 11.25C3.1 11.25 4 12.0938 4 13.125C4 14.1562 3.1 15 2 15C0.9 15 0 14.1562 0 13.125Z"
              fill="white"
            />
          </svg>

          <ul class="colorHeader__more--menu" v-if="showOptions">
            <router-link :to="`/subscription/edit/${subscription._id}`" tag="li">
              <i class="fa fa-pencil"></i> Edit
            </router-link>
            <li @click="handleRemoveSubscription($event, subscription._id)">
              <i class="fa fa-trash"></i> Remove
            </li>
            <li @click="handleDuplicateSubscription($event, subscription)">
              <i class="fa fa-copy"></i> Duplicate
            </li>
          </ul>
        </div>
      </div>
      <h3>{{subscription.name}}</h3>
      <p v-if="subscription.description">{{subscription.description}}</p>
      <h2>${{subscription.price}}</h2>
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
    <div class="displayGroup">
      <label class="displayGroup__label">Upcoming payments</label>
      <ul class="upcomingPayments">
        <li
          class="upcomingPayments__item"
          v-for="(paymentDate, index) in subscription.upcomingPayments"
          :key="index"
        >
          <p>{{convertToFromNow(paymentDate.isoString)}}</p>
          <p>
            <span>{{convertToString(paymentDate.isoString)}}</span>
          </p>
        </li>
      </ul>
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

import { EventBus } from "../../EventBus";

import { clickAway } from "../../mixins/clickAway";
import { subscriptionActions } from "../../mixins/subscriptionActions";
import { modal } from "../../mixins/modal";

import Spinner from "../general/Spinner";

export default {
  mixins: [clickAway, subscriptionActions, modal],
  components: {
    Spinner,
  },
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
      showOptions: false,
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

        this.modal(
          "There was an error loading that subscription. Please try again later.",
          "danger"
        );

        console.log(err);
      }
    },
    handleNotification() {
      this.modal("Notifications are coming soon!", "danger");
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
    convertToString(isoString) {
      const date = moment.utc(isoString);

      if (!date.isValid()) {
        return;
      }

      return date.format("MM/DD/YYYY");
    },
    convertToFromNow(isoString) {
      const date = moment.utc(isoString);

      if (!date.isValid()) {
        return;
      }

      return date.fromNow();
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
      return moment
        .utc(this.subscription.firstPaymentDate)
        .format("MMMM DD, YYYY");
    },
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
    font-size: 1.4em;
    margin-bottom: 0.4em;
  }

  h2 {
    font-size: 2.2em;
    margin-top: 0.4em;
    margin-bottom: 0.6em;
  }

  p {
    font-size: 1em;
  }

  .colorHeader__options {
    display: flex;
    align-items: center;
    padding: 1em;

    .colorHeader__close,
    .colorHeader__bell,
    .colorHeader__more {
      cursor: pointer;
      padding: 0px;
      position: relative;
    }

    .colorHeader__close {
      margin-right: auto;
    }

    .colorHeader__more {
      margin-left: 12px;

      .colorHeader__more--menu {
        position: absolute;
        right: 0;
        top: 48px;
        background: var(--containerBackground);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
        z-index: 2;
        border-radius: var(--borderRadius);
        color: var(--textLight);
        white-space: nowrap;
        text-align: left;

        li {
          padding: 1em 2em;
          line-height: 0.2;
          cursor: pointer;

          &:hover {
            background-color: rgba($color: #000000, $alpha: 0.05);
          }

          i {
            padding-right: 0.8em;
          }
        }
      }
    }
  }
}

.displayGroup {
  margin-bottom: 1.2em;

  .displayGroup__label {
    font-size: 0.8em;
    color: var(--textLight);
    margin-bottom: 0.4em;
    display: block;
  }

  .displayGroup__text {
    color: var(--textDark);
    font-size: 1em;
  }
}

.upcomingPayments {
  margin-top: 0.8em;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-template-rows: auto;
  grid-gap: 0.4em;

  .upcomingPayments__item {
    padding: 12px 16px;
    background-color: var(--bodyBackground);
    font-size: 100%;
    text-align: center;
    color: var(--textLight);

    p:first-child {
      margin-bottom: 6px;
    }

    span {
      font-size: 85%;
      font-weight: bold;
    }
  }
}

.divider {
  margin-bottom: 1em;
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