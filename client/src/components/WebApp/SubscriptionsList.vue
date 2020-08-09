<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error, try again later!</div>
  <div class="subscriptionsList" v-else>
    <div class="subscriptionsList__header">
      <div class="subscriptionsList__headerLeft">
        <h1>Subscriptions</h1>
        <p>{{subscriptions.length}} total</p>
        <div class="sortMethod__wrapper">
          <p>Sort by:</p>
          <div class="sortMethod">
            <p @click="handleDisplaySortMenu()">{{sortMethodDisplayName}}</p>
            <ul class="sortMethod__options" v-if="showSortMenu">
              <li @click="sortMethod = 'name'">Name</li>
              <li @click="sortMethod = 'duration'">Billing Period</li>
              <li @click="sortMethod = 'paymentMethod'">Payment Method</li>
              <li @click="sortMethod = 'price'">Price</li>
              <li @click="sortMethod = 'paidToDate'">Paid To Date</li>
              <li @click="sortMethod = 'firstPayment'">First Payment</li>
              <li @click="sortMethod = 'nextPayment'">Next Payment</li>
            </ul>
          </div>
          <div class="sortDirection" :class="{ sortDirection_rotate: sortDirection === -1 }">
            <div @click="switchSortDirection()" class="sortDirection__clicker">
              <img width="10" height="auto" src="/assets/sort-arrow.svg" alt />
            </div>
          </div>
        </div>
      </div>
      <div class="subscriptionsList__headerRight">
        <div class="button">
          View
          <i class="fa fa-list"></i>
        </div>
        <div class="button">
          Filter
          <i class="fa fa-filter"></i>
        </div>
        <router-link to="/dashboard/subscription/" tag="div" class="button button__add">
          Add Subscription
          <i class="fa fa-plus"></i>
        </router-link>
        <div class="button button__ellipsis">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
    </div>
    <div class="subscriptionsList__items">
      <div class="subscriptionsList__labels">
        <div class="color"></div>
        <div class="name">Name</div>
        <div class="price">Price</div>
        <div class="paidToDate">Paid To Date</div>
        <div class="billingPeriod">Billing Period</div>
        <div class="paymentMethod">Payment Method</div>
        <div class="tags">Tags</div>
        <div class="firstPayment">First Payment</div>
        <div class="nextPayment">Next Payment</div>
        <div class="options"></div>
      </div>
      <ul v-if="sortDirection === 1">
        <subscription-list-item
          v-for="(subscription, index) in subscriptions"
          :key="index"
          :subscription="subscription"
        />
      </ul>
      <ul v-else-if="sortDirection === -1">
        <subscription-list-item
          v-for="(subscription, index) in reverseSubscriptions"
          :key="index"
          :subscription="subscription"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import SubscriptionListItem from "./SubscriptionListItem";
import { EventBus } from "../../EventBus";
import moment from "moment";

export default {
  components: {
    SubscriptionListItem,
  },
  data: function () {
    return {
      loading: true,
      error: false,
      subscriptions: [],
      sortDirection: -1,
      sortMethod: "nextPayment",
      showSortMenu: false,
    };
  },
  watch: {
    sortMethod: function () {
      this.sortSubscriptions();
      this.showSortMenu = false;
    },
  },
  methods: {
    sortSubscriptions: function () {
      // TODO: Make this more DRY
      switch (this.sortMethod) {
        case "name":
        case "duration":
        case "paymentMethod": {
          this.subscriptions.sort((a, b) => {
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
          this.subscriptions.sort(
            (a, b) => a[this.sortMethod] - b[this.sortMethod]
          );
          break;
        }
        case "firstPayment": {
          this.subscriptions.sort((a, b) => {
            const x = moment(a.firstPaymentDate).valueOf();
            const y = moment(b.firstPaymentDate).valueOf();

            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          });
          break;
        }
        default:
        case "nextPayment": {
          this.subscriptions.sort((a, b) => {
            const x = moment(a.upcomingPayments[0].dateString).valueOf();
            const y = moment(b.upcomingPayments[0].dateString).valueOf();

            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          });
          break;
        }
      }
    },
    fetchSubscriptions: async function () {
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
        });

        // TODO: Remove this timeout when live
        setTimeout(() => {
          this.subscriptions.push(...subscriptions);
          this.loading = false;
        }, 400);
      } catch (err) {
        this.error = true;
        console.log(err);
      }
    },
    switchSortDirection: function () {
      this.sortDirection === -1
        ? (this.sortDirection = 1)
        : (this.sortDirection = -1);
    },
    handleDisplaySortMenu: function (bool) {
      if (typeof bool === "boolean") {
        this.showSortMenu = bool;
      } else {
        this.showSortMenu
          ? (this.showSortMenu = false)
          : (this.showSortMenu = true);
      }
    },
  },
  computed: {
    reverseSubscriptions: function () {
      return this.subscriptions.slice().reverse();
    },
    sortMethodDisplayName: function () {
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
  created: function () {
    this.fetchSubscriptions();

    EventBus.$on("refreshSubscriptions", () => {
      this.fetchSubscriptions();
    });
  },
};
</script>

<style lang="scss">
.subscriptionsList {
  padding: 2em;

  .subscriptionsList__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3em;
    user-select: none;
  }

  .subscriptionsList__headerLeft,
  .subscriptionsList__headerRight {
    display: flex;
    align-items: center;
  }

  .subscriptionsList__headerLeft {
    & > h1,
    & > p {
      margin-right: 32px;
    }

    .sortMethod__wrapper {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      .sortMethod {
        position: relative;
        margin-left: 12px;
        margin-right: 3px;

        p {
          font-weight: bold;
          cursor: pointer;
        }

        ul.sortMethod__options {
          position: absolute;
          top: 24px;
          left: 0;
          background-color: var(--containerBackground);
          box-shadow: 0 8px 4px rgba(0, 0, 0, 0.15);
          white-space: nowrap;

          li {
            padding: 1em 2em;
            cursor: pointer;

            &:hover {
              background-color: rgba(0, 0, 0, 0.07);
            }
          }
        }
      }
    }

    .sortDirection {
      img {
        transition: transform 100ms ease-in-out;
      }

      &.sortDirection_rotate {
        img {
          transform: rotate(180deg);
        }
      }

      .sortDirection__clicker {
        padding: 8px;
        border-radius: 32px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: grid;
        place-items: center;

        &:hover {
          background-color: rgba(0, 0, 0, 0.07);
        }
      }
    }
  }

  .subscriptionsList__headerRight {
    .button {
      $height: 38px;

      height: $height;
      background-color: var(--containerBackground);
      line-height: $height;
      border-radius: var(--borderRadius);
      padding-left: 2em;
      padding-right: 2em;
      cursor: pointer;

      i {
        padding-left: 0.4em;
      }

      &:not(:last-child) {
        margin-right: 1em;
      }

      &.button__add {
        background-color: var(--mainAccent);
        color: #fff;
      }

      &.button__ellipsis {
        padding: 0 1em;
        background-color: var(--mainAccentFaint);
        color: var(--mainAccent);

        i {
          padding-left: 0;
        }
      }
    }
  }

  .subscriptionsList__items {
    .subscriptionsList__labels {
      $height: 62px;

      display: flex;
      padding: 0 0 1em;
      font-size: 80%;
      font-weight: bold;

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
    }
  }
}
</style>