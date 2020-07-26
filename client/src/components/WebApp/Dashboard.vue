<template>
  <main id="dashboard-wrapper">
    <div id="left">
      <div class="new-subscription-wrapper">
        <router-link to="/app/dashboard/subscription/new" class="add-subscription-button">
          <i class="fas fa-plus"></i>
        </router-link>
      </div>
      <div class="header">
        <span id="show-menu-btn" @click="toggleMenu">
          <i class="fa fa-bars"></i>
        </span>
        <h5>Subscriptions</h5>
        <span id="sort-button">
          <i class="fa fa-sort-amount-down"></i>
        </span>
        <span id="subscriptions-options-btn">
          <i class="fas fa-ellipsis-h"></i>
        </span>
      </div>
      <div v-if="loading" class="spinner-container">
        <i class="spinner"></i>
      </div>
      <div v-else-if="error">
        There was an error with that request. Please try again later.
      </div>
      <ul v-else class="subscription-list">
        <router-link
          tag="li"
          class="subscription-list-item"
          :class="{selected: id === loadedSubscriptionId }"
          :to="{path: `/app/dashboard/subscription/view/${id}`}"
          v-for="({_id: id, name, paymentDates, price, color}, index) in subscriptions"
          :key="index"
          :style="{backgroundColor: color}"
        >
          <span class="name">{{name}}</span>
          <span class="date">{{paymentDates[0] | moment("dddd, MMMM Do YYYY")}}</span>
          <span class="price">{{price}}</span>
        </router-link>
      </ul>
    </div>
    <div id="right">
      <!-- // TODO: Fix this transition acting weird -->
      <transition name="slide" mode="out-in">
        <router-view
          @refreshSubscriptions="fetchSubscriptions"
          @closeRightMenu="$emit('closeRightMenu')"
        ></router-view>
      </transition>
    </div>
  </main>
</template>

<script>
import moment from "moment";

export default {
  data: function () {
    return {
      loading: true,
      error: false,
      // User's subscriptions
      subscriptions: []
    };
  },
  methods: {
    getPaymentDates: function ({ firstPaymentDate, duration }) {
      const upcomingPaymentsCount = 10;

      // These should return future payment dates in unix timestamps

      switch (duration) {
        case "year": {
          return [Date.now()];
        }
        default:
        case "month": {
          const dates = [];

          const paymentDay = moment(firstPaymentDate).date();
          const now = moment();
          const todaysDay = now.date();

          if (paymentDay < todaysDay) {
            for (let i = 1; i <= upcomingPaymentsCount; i++) {
              dates.push(
                moment(firstPaymentDate)
                  .year(now.year())
                  .month(now.month() + i)
                  .valueOf()
              );
            }
          } else {
            for (let i = 0; i < upcomingPaymentsCount; i++) {
              dates.push(
                moment(firstPaymentDate)
                  .year(now.year())
                  .month(now.month() + i)
                  .valueOf()
              );
            }
          }

          return dates;
        }
        case "day": {
          console.log("day");
          return [Date.now()];
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
          subscriptions[index].paymentDates = this.getPaymentDates(
            subscription,
            index
          );
        });

        this.subscriptions.push(...subscriptions);
        this.loading = false;
      } catch (err) {
        this.error = true;
        console.log(err);
      }
    },
    toggleMenu: function () {
      this.$emit("toggleMenu", true);
    },
  },
  created: function () {
    this.fetchSubscriptions();
  },
  computed: {
    loadedSubscriptionId: function () {
      const data = this.$route.params;

      if (data.id) return data.id;
      else return false;
    },
  },
};
</script>

<style lang="scss">
li.subscription-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.9rem;
  padding: 1em;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .name {
    flex: auto;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .date {
    font-size: 0.5em;
    flex-basis: auto;
    text-align: right;
    white-space: nowrap;

    @media screen and (max-width: 464px) {
      display: none;
    }
  }

  .price {
    font-size: 0.8em;
    font-weight: bold;
    text-align: right;
    padding-left: 16px;
    flex-basis: 84px;
    flex-shrink: 0;

    &::before {
      content: "$";
      font-size: 0.7em;
      opacity: 0.4;
      letter-spacing: 3px;
    }
  }

  &.router-link-active {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.header {
  display: flex;
  margin-bottom: 1.5em;
  align-items: center;

  #show-menu-btn {
    cursor: pointer;
    margin-right: 16px;
    padding: 8px;
  }

  h5 {
    flex-grow: 1;
    text-transform: capitalize;
  }

  #subscriptions-options-btn {
    margin-left: 12px;
  }
}

// Add Subscription Button

.new-subscription-wrapper {
  margin: 32px;
  position: absolute;
  bottom: 0;
  right: 0;

  .add-subscription-button {
    display: block;
    opacity: 1;
    color: white;
    cursor: pointer;
    background-color: cadetblue;
    border-radius: 50%;
    padding: 16px;
  }
}

// Transitions

.slide-leave-active,
.slide-enter-active {
  transition: transform 600ms ease, opacity 900ms ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.slide-enter-to,
.slide-leave {
  transform: translateX(0px);
  opacity: 1;
}

.fade-up-short-leave-active,
.fade-up-short-enter-active {
  transition: transform 100ms ease-in-out, opacity 50ms ease;
}

.fade-up-short-enter,
.fade-up-short-leave-to {
  transform: translateY(6px);
  opacity: 0;
}

.fade-up-short-enter-to,
.fade-up-short-leave {
  transform: translateY(0px);
  opacity: 1;
}
</style>