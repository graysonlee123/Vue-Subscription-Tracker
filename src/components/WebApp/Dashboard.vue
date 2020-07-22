<template>
  <main id="page-wrapper">
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
      <div class="subscription-list">
        <div v-if="isLoading">Spinner</div>
        <ul v-else>
          <li
            class="subscription"
            v-for="({_id: id, name, paymentDates, price, color}, index) in subscriptions"
            :key="index"
            :class="{ selected: id === loadedSubscriptionId }"
          >
            <div class="s-left">
              <div
                class="subscription-preview-card"
                @click="handleLoadSubscription(id)"
              >
                <span class="name">{{name}}</span>
                <span class="date">{{paymentDates[0] | moment("dddd, MMMM Do YYYY")}}</span>
                <span class="price">{{price}}</span>
              </div>
              <div class="subscription-line" :style="{ backgroundColor: color} "></div>
            </div>
            <div class="s-right">
              <i class="fas fa-ellipsis-v" @click="toggleSubscriptionOptionsMenu(id)"></i>
              <transition name="fade-up-short">
                <subscription-menu
                  v-if="openedSubscriptionOptionsMenu === id"
                  :subscription-id="id"
                  v-on:fetchSubscriptions="fetchSubscriptions"
                />
              </transition>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="right">
      <transition name="fade-up" mode="out-in">
        <router-view @refreshSubscriptions="fetchSubscriptions"></router-view>
      </transition>
    </div>
  </main>
</template>

<script>
import SubscriptionMenu from "./SubscriptionMenu";
import axios from "axios";
import { EventBus } from "../../EventBus";
import moment from "moment";

export default {
  data: function () {
    return {
      isLoading: true,
      // User's subscriptions
      subscriptions: [],
      // ID of loaded subscription
      openedSubscriptionOptionsMenu: false,
    };
  },
  methods: {
    getPaymentDates: function (
      { firstPaymentDate, interval, duration },
      index
    ) {
      const date = new Date(firstPaymentDate);
      const upcomingPaymentsCount = 10;

      // These should return future payment dates in unix timestamps

      switch (duration) {
        case "year":
          return [Date.now()];
          console.log("year");

          break;
        default:
        case "month":
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
          break;
        case "day":
          console.log("day");
          return [Date.now()];
          break;
      }
    },
    fetchSubscriptions: async function () {
      try {
        this.isLoading = true;
        this.subscriptions = [];

        const res = await axios.get("http://localhost:3000/api/subscription");
        const subscriptions = res.data.subscriptions;

        if (!subscriptions) {
          this.showNewSubForm = true;
          this.isLoading = false;
          return;
        }

        subscriptions.forEach((subscription, index) => {
          subscriptions[index].paymentDates = this.getPaymentDates(
            subscription,
            index
          );
        });

        this.subscriptions.push(...subscriptions);

        this.showNewSubForm = false;
        this.openedSubscriptionOptionsMenu = false;
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    toggleSubscriptionOptionsMenu: function (id) {
      this.openedSubscriptionOptionsMenu === id
        ? (this.openedSubscriptionOptionsMenu = false)
        : (this.openedSubscriptionOptionsMenu = id);
    },
    toggleMenu: function () {
      this.$emit("toggleMenu", true);
    },
    handleLoadSubscription: function (id) {
      this.$router.push("/app/dashboard/subscription/" + id);
      this.showNewSubForm = false;
      this.$emit("showItem");
    },
  },
  components: {
    subscriptionMenu: SubscriptionMenu,
  },
  created: function () {
    this.fetchSubscriptions();
  },
  computed: {
    loadedSubscriptionId: function() {
      const data = this.$route.params;
      
      if (data.id) return data.id;
      else return false;
    }
  }
};
</script>

<style lang="scss">
li.subscription {
  $card-height: 36px;

  display: grid;
  grid-template-columns: 1fr auto;
  height: $card-height;
  line-height: $card-height;
  margin-bottom: 12px;
  font-size: 0.9rem;

  .s-right {
    position: relative;

    > i {
      font-size: 0.8em;
      padding: 0 0.5em 0 1em;
      color: rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
  }

  .subscription-preview-card {
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    transition: transform 80ms ease-in-out;

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
      opacity: 0.4;
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
  }

  .subscription-line {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  &.selected {
    .subscription-preview-card {
      background-color: rgba(255, 255, 255, 0.1);
    }
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

.fade-up-leave-active,
.fade-up-enter-active {
  transition: transform 400ms ease-in-out, opacity 200ms ease;
}

.fade-up-enter {
  transform: translateY(60px);
  opacity: 0;
}

.fade-up-enter-to {
  transform: translateY(0px);
  opacity: 1;
}
.fade-up-leave {
  transform: translateY(0px);
  opacity: 1;
}

.fade-up-leave-to {
  transform: translateY(60px);
  opacity: 0;
}

.fade-up-short-leave-active,
.fade-up-short-enter-active {
  transition: transform 100ms ease-in-out, opacity 50ms ease;
}

.fade-up-short-enter {
  transform: translateY(6px);
  opacity: 0;
}

.fade-up-short-enter-to {
  transform: translateY(0px);
  opacity: 1;
}

.fade-up-short-leave {
  opacity: 1;
}

.fade-up-short-leave-to {
  opacity: 0;
}
</style>