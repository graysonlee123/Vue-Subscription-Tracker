<template>
  <div class="spinner-container" v-if="loading">
    <i class="spinner"></i>
  </div>
  <div v-else-if="error">There was an error processing this request. Please try again.</div>
  <article v-else class="subscription">
    <div class="price-box" :style="{backgroundColor: subscription.color}">
      <h3>{{subscription.name}}</h3>
      <p class="description" v-if="subscription.description">{{subscription.description}}</p>
      <h2>${{subscription.price}}</h2>
      <div class="options-wrapper">
        <i class="fas fa-ellipsis-v" @click="toggleShowOptions"></i>
        <ul v-if="showOptions" class="subscription-options">
          <router-link :to="`/app/dashboard/subscription/edit/${subscriptionId}`" tag="li">Edit subscription</router-link>
          <li>Remove subscription</li>
        </ul>
      </div>
    </div>
    <ul class="tags">
      <li>Productivity</li>
    </ul>
    <div class="field billing-period">
      <label>Billing period</label>
      <p>every {{subscription.interval > 1 ? subscription.interval : ''}} {{subscription.duration}}{{subscription.interval > 1 ? 's' : ''}}</p>
    </div>
    <div class="field upcoming-payments">
      <label>Next payment</label>
      <div class="upcoming-payment">
        <p>{{subscription.upcomingPayments[0].fromNow}} ({{subscription.upcomingPayments[0].dateString}})</p>
        <i class="fa fa-chevron-down" @click="toggleUpcomingPayments()"></i>
      </div>
      <div class="upcoming-dropdown" v-if="showUpcomingPayments">
        <div
          class="upcoming-box"
          v-for="(date, index) in subscription.upcomingPayments"
          :key="index"
        >
          <p class="box-header">{{date.dateString}}</p>
          <p class="box-sub">{{date.fromNow}}</p>
        </div>
      </div>
    </div>
    <div class="field first-payment">
      <label>First payment</label>
      <p>{{firstPaymentString}}</p>
    </div>
    <div class="field paid-in-total">
      <label>Total amount paid</label>
      <p>${{subscription.totalAmountPaid.toFixed(2)}}</p>
    </div>
    <div v-if="subscription.paymentMethod" class="field payment-method">
      <label>Payment method</label>
      <p>{{subscription.paymentMethod}}</p>
    </div>
    <div v-if="subscription.note" class="field note">
      <label>Payment note</label>
      <p>{{subscription.note}}</p>
    </div>
  </article>
</template>

<script>
import moment from "moment";

export default {
  props: {
    subscriptionId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      loading: true,
      error: false,
      subscription: null,
      showUpcomingPayments: false,
      showOptions: false
    };
  },
  methods: {
    fetchSubscription: async function () {
      this.loading = true;
      this.error = false;
      this.subscription = null;
      this.showOptions = false;
      this.showUpcomingPayments = false;

      try {
        const req = await this.$http.get(
          `/api/subscription/${this.subscriptionId}`
        );

        this.subscription = req.data.subscription;
        this.getUpcomingPayments();
        this.loading = false;
      } catch (err) {
        this.error = true;
        this.loading = false;

        console.log(err);
      }
    },
    toggleUpcomingPayments: function () {
      this.showUpcomingPayments
        ? (this.showUpcomingPayments = false)
        : (this.showUpcomingPayments = true);
    },
    getUpcomingPayments: function () {
      // Should remain an arrow function to remain this binding
      const pushDateToUpcoming = (date) => {
        this.subscription.upcomingPayments.push({
          dateString: date.format("MM/DD/YY"),
          fromNow: date.fromNow(),
        });
      };
      
      const duration = this.subscription.duration;

      // Set initial values in subscription data
      this.subscription.upcomingPayments = [];
      this.subscription.totalAmountPaid = 0;

      // Logic Begins
      const date = moment(this.subscription.firstPaymentDate);

      // "fast forward" until we find the next payment date
      while (moment().isAfter(date)) {
        date.add(this.subscription.interval, this.subscription.duration + "s");
        this.subscription.totalAmountPaid += this.subscription.price;
      }

      pushDateToUpcoming(date);

      for (let i = 0; i < 7; i++) {
        date.add(this.subscription.interval, this.subscription.duration + "s");
        pushDateToUpcoming(date);
      }
    },
    toggleShowOptions: function() {
      this.showOptions ? this.showOptions = false : this.showOptions = true;
    }
  },
  computed: {
    firstPaymentString: function () {
      return moment(this.subscription.firstPaymentDate).format("MM/DD/YY");
    },
  },
  created: function () {
    this.fetchSubscription();
  },
  watch: {
    $route: function() {
      this.fetchSubscription();
    }
  }
};
</script>

<style lang="scss">
article.subscription {
  font-size: 1rem;
  padding: 2em;

  .price-box {
    border-radius: 6px;
    padding: 2.4em 1em;
    background-color: #333;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 1em;
    position: relative;

    h2 {
      font-size: 1.8em;
      margin-top: 0.6em;
    }

    h3 {
      font-size: 1.2em;
      margin-bottom: 0.3em;
    }

    p {
      font-size: 0.7em;
    }
  }

  .options-wrapper {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 0.8rem;
    text-align: left;
    white-space: nowrap;
    user-select: none;

    i {
      padding: 0.4em;
      cursor: pointer;
    }

    .subscription-options {
      position: absolute;
      top: 32px;
      right: 0;
      background-color: #333;
      box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
      font-size: 0.9em;
      border-radius: 4px;

      li {
        padding: 1em;
        cursor: pointer;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }

  .tags {
    font-size: 0.6em;
    margin-bottom: 2em;

    li {
      padding: 0.6em 1em;
      border-radius: 1em;
      background-color: grey;
      display: inline-block;
    }
  }

  .field {
    margin-bottom: 0.8em;
    padding-bottom: 0.8em;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }

    label {
      font-size: 0.7em;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.3em;
      display: block;
    }

    &.upcoming-payments {
      .upcoming-payment {
        display: flex;
        justify-content: space-between;

        i {
          margin-right: 0.4em;
        }
      }

      .upcoming-dropdown {
        display: flex;
        font-size: 0.8rem;
        overflow-x: auto;

        .upcoming-box {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          text-align: center;
          padding: 0.6em 0.8em;
          margin: 1em 0.2em 0;
          min-width: 90px;

          &:first-child {
            margin-left: 0;
          }

          &:last-child {
            margin-right: 0;
          }

          .box-header {
            font-weight: bold;
            margin-bottom: 0.3em;
          }

          .box-sub {
            font-size: 0.8em;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
}
</style>