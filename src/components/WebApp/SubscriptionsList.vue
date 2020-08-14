<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error, try again later!</div>
  <div class="subscriptionsList" v-else>
    <div class="subscriptionsList__header">
      <div class="subscriptionsList__headerLeft">
        <h1>Subscriptions</h1>
        <p>
          {{organizedSubscriptions.length}} total
          <span v-if="filter !== 'all'">(filtered)</span>
        </p>
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
              <img width="10" height="auto" src="@/assets/sort-arrow.svg" alt />
            </div>
          </div>
        </div>
      </div>
      <div class="subscriptionsList__headerRight">
        <div class="button">
          View
          <i class="fa fa-list"></i>
        </div>
        <div class="button filter" @click="handleDisplayFilterMenu()">
          <span>
            Filter
            <i class="fa fa-filter"></i>
          </span>
          <ul class="filter__options" v-if="showFilterMenu">
            <li @click="filter = 'all'">Show All</li>
            <li @click="filter = 'week'">In a week</li>
            <li @click="filter = 'month'">In a month</li>
            <li @click="filter = 'year'">In a year</li>
          </ul>
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
      <ul v-if="subscriptions.length > 0">
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
  </div>
</template>

<script>
import SubscriptionListItem from './SubscriptionListItem';
import { EventBus } from '../../EventBus';
import moment from 'moment';

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
      sortMethod: 'nextPayment',
      showSortMenu: false,
      filter: 'all',
      showFilterMenu: false,
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
  methods: {
    async fetchSubscriptions() {
      try {
        this.loading = true;
        this.subscriptions = [];

        const res = await this.$http.get('/api/subscription');
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
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);

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
      if (typeof bool === 'boolean') {
        this.showSortMenu = bool;
      } else {
        this.showSortMenu
          ? (this.showSortMenu = false)
          : (this.showSortMenu = true);
      }
    },
    handleDisplayFilterMenu(bool) {
      if (typeof bool === 'boolean') {
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
        case 'all': {
          organizedSubs = organizedSubs.filter(sub => sub);
          break;
        }
        case 'week': {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString,
            );
            const weekFromNow = moment.utc().add(1, 'weeks');

            if (nextPaymentDate.isBefore(weekFromNow)) {
              return true;
            }
          });
          break;
        }
        case 'month': {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString,
            );
            const monthFromNow = moment.utc().add(1, 'months');

            if (nextPaymentDate.isBefore(monthFromNow)) {
              return true;
            }
          });
          break;
        }
        case 'year': {
          organizedSubs = organizedSubs.filter((sub) => {
            const nextPaymentDate = moment.utc(
              sub.upcomingPayments[0].isoString,
            );
            const yearFromNow = moment.utc().add(1, 'years');

            if (nextPaymentDate.isBefore(yearFromNow)) {
              return true;
            }
          });
          break;
        }
      }

      // Then sort them
      switch (this.sortMethod) {
        case 'name':
        case 'duration':
        case 'paymentMethod': {
          organizedSubs.sort((a, b) => {
            const x = a[this.sortMethod].toLowerCase();
            const y = b[this.sortMethod].toLowerCase();

            if (x > y) return -1;
            if (x < y) return 1;
            return 0;
          });
          break;
        }
        case 'price':
        case 'paidToDate': {
          organizedSubs.sort((a, b) => a[this.sortMethod] - b[this.sortMethod]);
          break;
        }
        case 'firstPayment': {
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
        case 'nextPayment': {
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
        case 'name': {
          return 'Name';
          break;
        }
        case 'duration': {
          return 'Billing Period';
          break;
        }
        case 'paymentMethod': {
          return 'Payment Method';
          break;
        }
        case 'price': {
          return 'Price';
          break;
        }
        case 'paidToDate': {
          return 'Paid To Date';
          break;
        }
        case 'firstPayment': {
          return 'First Payment';
          break;
        }
        case 'nextPayment': {
          return 'Next Payment';
          break;
        }
      }
    },
  },
  created() {
    this.fetchSubscriptions();

    EventBus.$on('refreshSubscriptions', () => {
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

  .filter,
  .sortMethod {
    position: relative;
  }

  ul.filter__options,
  .sortMethod__options {
    position: absolute;
    top: 24px;
    left: 0;
    background-color: var(--containerBackground);
    box-shadow: 0 8px 4px rgba(0, 0, 0, 0.15);
    white-space: nowrap;

    li {
      padding: 1em 2em;
      cursor: pointer;
      line-height: 16px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.07);
      }
    }
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
        margin-left: 12px;
        margin-right: 3px;

        p {
          font-weight: bold;
          cursor: pointer;
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
    .empty {
      padding: 1em;

      a {
        color: inherit;
        text-decoration: underline;
        text-decoration-color: var(--mainAccent);
      }
    }

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
