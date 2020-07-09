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
            :class="{ selected: loadedSubscriptionIndex === index }"
          >
            <div class="s-left">
              <div class="subscription-preview-card" @click="handleLoadSubscription(index)">
                <span class="name">{{subscription.name}}</span>
                <span class="date">{{subscription.paymentDates[0] | moment("dddd, MMMM Do YYYY")}}</span>
                <span class="price">{{subscription.price.$numberDecimal}}</span>
              </div>
              <div class="subscription-line" :style="{ backgroundColor: subscription.color} "></div>
            </div>
            <div class="s-right">
              <i class="fas fa-ellipsis-v" @click="handleOpenSubMenu(index)"></i>
              <div class="options-menu" v-if="showOptionsMenuId === index">
                <ul>
                  <li>
                    <i class="fa fa-tag"></i> Tags
                  </li>
                  <li @click="handleConfirmDelete(subscription._id)">
                    <i class="fa fa-trash"></i> Delete
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="right">
      <div v-if="isLoading">Spinner</div>
      <div v-else-if="showNewSubForm">
        <subscription-form v-on:getSubscriptions="fetchSubscriptions" />
      </div>
      <div v-else-if="loadedSubscriptionIndex >= 0">
        <subscription-form
          v-bind:subscriptionProp="subscriptions[loadedSubscriptionIndex]"
          v-on:getSubscriptions="fetchSubscriptions"
        />
      </div>
      <div class="no-subscription-container" v-else>
        <i class="fas fa-question-circle"></i>
        <p>Select a subscription to view its details, or add a new one.</p>
      </div>
    </div>
  </div>
</template>

<script>
import AddSubscriptionForm from "./SubscriptionForm";
import axios from "axios";
import { EventBus } from "../../EventBus";
import moment from "moment";

export default {
  data: function() {
    return {
      isLoading: true,
      subscriptions: [],
      loadedSubscriptionIndex: -1,
      showNewSubForm: false,
      showOptionsMenuId: -1
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
    fetchSubscriptions: async function() {
      try {
        this.isLoading = true;
        this.loadedSubscriptionIndex = -1;
        this.subscriptions = [];

        const res = await axios.get("http://localhost:3000/api/subscription");
        const subscriptions = res.data.subscriptions;

        if (!subscriptions) {
          return (this.showNewSubForm = true);
        }

        subscriptions.forEach((subscription, index) => {
          subscriptions[index].paymentDates = this.getPaymentDates(
            subscription,
            index
          );
        });

        this.subscriptions.push(...subscriptions);

        this.showOptionsMenuId = -1;
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleAddNewForm: function() {
      this.showNewSubForm = true;
      this.$emit("showItem");
    },
    handleOpenSubMenu: function(i) {
      this.showOptionsMenuId = i;
    },
    toggleMenu: function() {
      this.$emit("toggleMenu", true);
    },
    handleLoadSubscription: function(index) {
      this.loadedSubscriptionIndex = index;
      this.showNewSubForm = false;
      this.$emit("showItem");
    },
    handleConfirmDelete: async function(id) {
      if (!confirm("Are you sure? Deleting a subscription is permanent."))
        return;

      try {
        const subscription = await axios.delete(
          `http://localhost:3000/api/subscription/${id}`
        );

        this.fetchSubscriptions();
      } catch (err) {
        console.log(err);
      }
    }
  },
  components: {
    subscriptionForm: AddSubscriptionForm
  },
  created: function() {
    this.fetchSubscriptions();
  }
};
</script>

<style lang="scss">
li.subscription {
  $card-height: 48px;

  display: grid;
  grid-template-columns: 1fr auto;
  height: $card-height;
  line-height: $card-height;
  margin-bottom: 12px;

  .s-right {
    position: relative;

    > i {
      padding: 1em;
      cursor: pointer;
    }

    .options-menu {
      position: absolute;
      line-height: 1;
      font-size: 0.8rem;
      top: $card-height + 12px;
      right: -10px;
      padding: 1em 0;
      background-color: #333;
      border-radius: 12px;
      z-index: 5;

      i {
        padding: 0 12px 0 0;
      }

      li {
        cursor: pointer;
        width: 120px;
        padding: 1em;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
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