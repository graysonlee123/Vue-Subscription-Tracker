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
        <img
          class="colorHeader__bell"
          src="@/assets/bell-light.svg"
          alt="Notifications"
          @click="handleNotification"
        />
        <div
          class="colorHeader__more"
          ref="subscriptionOptionsMenu"
          data-name="showOptions"
          @click="showOptions = !showOptions"
        >
          <img class="colorHeader__more--img" src="@/assets/more-light.svg" alt="More" />
          <ul class="colorHeader__more--menu" v-if="showOptions">
            <router-link :to="`/dashboard/subscription/${subscription._id}/edit`" tag="li">
              <i class="fa fa-pencil"></i> Edit
            </router-link>
            <li @click="handleRemoveSubscription">
              <i class="fa fa-trash"></i> Remove
            </li>
            <li @click="handleDuplicateSubscription">
              <i class="fa fa-copy"></i> Duplicate
            </li>
          </ul>
        </div>
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
      <label class="displayGroup__label">Next payment</label>
      <p class="displayGroup__text">{{computeNextPaymentString}}</p>
    </div>
    <div class="displayGroup">
      <label class="displayGroup__label">Upcoming payments</label>
      <ul class="upcomingPayments">
        <li
          class="upcomingPayments__item"
          v-for="(paymentDate, index) in subscription.upcomingPayments"
          :key="index"
        >{{convertToString(paymentDate.isoString)}}</li>
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
import { v4 as uuidv4 } from "uuid";
import { clickAway } from "../../mixins/clickAway";
import { EventBus } from "../../EventBus";

export default {
  props: {
    subscriptionId: {
      type: String,
      required: true,
    },
  },
  mixins: [clickAway],
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

        this.$store.dispatch("addModal", {
          type: "danger",
          message:
            "There was an error loading that subscription. Please try again later.",
          uuid: uuidv4(),
        });

        console.log(err);
      }
    },
    async handleRemoveSubscription(e) {
      e.preventDefault();

      try {
        const req = await this.$http.delete(
          `/api/subscription/${this.subscription._id}`
        );

        EventBus.$emit("refreshSubscriptions");

        this.$router.push("/dashboard");
        this.$store.dispatch("addModal", {
          type: "success",
          message: "Subscription was removed.",
          uuid: uuidv4(),
        });
      } catch (err) {
        this.$store.dispatch("addModal", {
          type: "danger",
          message:
            "There was an error removing that subscription. Please try again later.",
          uuid: uuidv4(),
        });
        console.log(err);
      }
    },
    async handleDuplicateSubscription(e) {
      e.preventDefault();

      try {
        const subscriptionReq = {
          price: this.subscription.price,
          name: this.subscription.name,
          description: this.subscription.description,
          firstPaymentDate: this.subscription.firstPaymentDate,
          interval: this.subscription.interval,
          duration: this.subscription.duration,
          color: this.subscription.color,
          paymentMethod: this.subscription.paymentMethod,
          note: this.subscription.note,
        };

        const req = await this.$http.post(
          "/api/subscription/",
          subscriptionReq
        );

        EventBus.$emit("refreshSubscriptions");

        this.$router.push(
          `/dashboard/subscription/${req.data.subscription._id}/edit`
        );

        this.$store.dispatch("addModal", {
          type: "success",
          message: "You are now editing the duplicated subscription.",
          uuid: uuidv4(),
          duration: 5000
        });
      } catch (err) {
        console.log(err);
        this.$store.dispatch("addModal", {
          type: "danger",
          message:
            "There was an error duplicating that subscription. Please try again later.",
          uuid: uuidv4(),
        });
      }
    },
    handleNotification() {
      this.$store.dispatch("addModal", {
        type: "danger",
        message:
          "Notifications are coming soon!",
        uuid: uuidv4(),
      });
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
    computeNextPaymentString() {
      return moment
        .utc(this.subscription.upcomingPayments[0].isoString)
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

.upcomingPayments {
  margin: 1em -0.3em 0;
  display: flex;
  flex-wrap: wrap;

  .upcomingPayments__item {
    padding: 12px 16px;
    background-color: var(--bodyBackground);
    margin: 0.3em;
    font-size: 80%;
    flex-grow: 1;
    text-align: center;
    color: var(--textDark);
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