<template>
  <div>
    <div id="left">
      <div class="new-subscription-wrapper">
        <div class="add-subscription-button" @click="handleAddNewForm">
          <i class="fas fa-plus"></i>
        </div>
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
            v-for="(subscription, index) in subscriptions"
            :key="index"
            :class="{ selected: viewSubscriptionID === index }"
          >
            <div class="s-left">
              <div
                class="subscription-preview-card"
                @click="handleLoadSubscription(subscription._id)"
              >
                <span class="name">{{subscription.name}}</span>
                <span class="date">{{subscription.paymentDates[0] | moment("dddd, MMMM Do YYYY")}}</span>
                <span class="price">{{subscription.price.$numberDecimal}}</span>
              </div>
              <div class="subscription-line" :style="{ backgroundColor: subscription.color} "></div>
            </div>
            <div class="s-right">
              <i class="fas fa-ellipsis-v" @click="toggleSubscriptionOptionsMenu(index)"></i>
              <subscription-menu
                v-if="openedSubscriptionOptionsMenu === index"
                :subscription-id="subscription._id"
                v-on:fetchSubscriptions="fetchSubscriptions"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="right">
      <div v-if="isLoading">Spinner</div>
      <subscription-form v-else-if="showNewSubForm" v-on:fetchSubscriptions="fetchSubscriptions" />
      <subscription-form
        v-else-if="viewSubscriptionID != ''"
        v-bind:subscriptionProp="subscriptions[subIndex]"
        v-bind:index="subIndex"
        v-on:fetchSubscriptions="fetchSubscriptions"
      />
      <div class="no-subscription-container" v-else>
        <i class="fas fa-question-circle"></i>
        <p>Select a subscription to view its details, or add a new one.</p>
      </div>
    </div>
  </div>
</template>

<script>
import AddSubscriptionForm from "./SubscriptionForm";
import SubscriptionMenu from "./SubscriptionMenu";
import axios from "axios";
import { EventBus } from "../../EventBus";
import moment from "moment";

export default {
  data: function() {
    return {
      isLoading: true,
      // User's subscriptions
      subscriptions: [],
      // ID of loaded subscription
      viewSubscriptionID: "",
      showNewSubForm: false,
      openedSubscriptionOptionsMenu: -1
    };
  },
  methods: {
    getPaymentDates: function({ firstPaymentDate, interval, duration }, index) {
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
    fetchSubscriptions: async function(displaySubId = "") {
      try {
        this.isLoading = true;
        this.viewSubscriptionID = "";
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
        this.openedSubscriptionOptionsMenu = -1;
        this.viewSubscriptionID = displaySubId;
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleAddNewForm: function() {
      this.showNewSubForm = true;
      this.$emit("showItem");
    },
    toggleSubscriptionOptionsMenu: function(i) {
      this.openedSubscriptionOptionsMenu === i
        ? (this.openedSubscriptionOptionsMenu = -1)
        : (this.openedSubscriptionOptionsMenu = i);
    },
    toggleMenu: function() {
      this.$emit("toggleMenu", true);
    },
    handleLoadSubscription: function(id) {
      this.viewSubscriptionID = id;
      this.showNewSubForm = false;
      this.$emit("showItem");
    }
  },
  components: {
    subscriptionForm: AddSubscriptionForm,
    subscriptionMenu: SubscriptionMenu
  },
  created: function() {
    this.fetchSubscriptions();
  },
  computed: {
    subIndex: function() {

      //TODO: Rework this function
      let index = null;

      const sub = this.subscriptions.find((sub, i) => {
        if (sub._id === this.viewSubscriptionID) {
          index = i;
          return true;
        }
      });

      return index;
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

.no-subscription-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;

  i {
    font-size: 64px;
    margin-bottom: 2rem;
    color: #fcfcfc;
  }
}

// Add Subscription Button

.new-subscription-wrapper {
  margin: 32px;
  position: absolute;
  bottom: 0;
  right: 0;

  .add-subscription-button {
    cursor: pointer;
    background-color: cadetblue;
    border-radius: 50%;
    padding: 16px;
    color: white;
  }
}
</style>