<template>
  <div class="spinner-container" v-if="loading">
    <i class="spinner"></i>
  </div>
  <div v-else-if="error">There was an error processing this request. Please try again.</div>
  <article v-else class="subscription">
    <div class="price-box" :style="{backgroundColor: subscription.color}">
      <h3>{{subscription.name}}</h3>
      <p class="description" v-if="subscription.description">{{subscription.description}}</p>
      <h2>{{subscription.price}}</h2>
    </div>
    <ul class="tags">
      <li>Productivity</li>
    </ul>
    <div class="field billing-period">
      <label>Billing period</label>
      <p>every {{subscription.duration}}</p>
    </div>
    <div class="field upcoming-payments">
      <label>Next payment</label>
      <div class="upcoming-payment">
        <p>in ___ months (00/00/00)</p>
        <i class="fa fa-chevron-down" @click="toggleUpcomingPayments()"></i>
      </div>
      <div class="upcoming-dropdown" v-if="showUpcomingPayments">
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
        <div class="upcoming-box">
          <p class="box-header">00/00/00</p>
          <p class="box-sub">in 1 year</p>
        </div>
      </div>
    </div>
    <div class="field first-payment">
      <label>First payment</label>
      <p>every ...</p>
    </div>
    <div class="field paid-in-total">
      <label>Total amount paid</label>
      <p>every ...</p>
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
    };
  },
  methods: {
    fetchSubscription: async function () {
      this.loading = true;
      this.error = false;
      this.subscription = null;

      try {
        const req = await this.$http.get(
          `/api/subscription/${this.subscriptionId}`
        );

        this.subscription = req.data.subscription;
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
  },
  created: function () {
    this.fetchSubscription();
  },
  getUpcomingPayments: function() {
    
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

    h2 {
      font-size: 1.8em;
      margin-top: 0.6em;

      &::before {
        content: "$"
      }
    }

    h3 {
      font-size: 1.2em;
      margin-bottom: 0.3em;
    }

    p {
      font-size: 0.7em;
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

    p {
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