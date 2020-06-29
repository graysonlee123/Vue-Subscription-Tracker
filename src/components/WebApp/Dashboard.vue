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
            <div class="subscription-preview-card" @click="handleLoadSubscription(index)">
              <span class="name">{{subscription.name}}</span>
              <span class="date">{{subscription.firstPaymentDate | moment("dddd, MMMM Do YYYY")}}</span>
              <span class="price">{{subscription.price.$numberDecimal}}</span>
              <span class="color">
                <div class="color-el" :style="{backgroundColor: subscription.color}"></div>
              </span>
            </div>
            <div class="subscription-line"></div>
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

export default {
  data: function() {
    return {
      isLoading: true,
      subscriptions: [],
      loadedSubscriptionIndex: -1,
      showNewSubForm: false
    };
  },
  methods: {
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

        this.subscriptions.push(...subscriptions);
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleAddNewForm: function() {
      this.showNewSubForm = true;
      this.$emit("showItem");
    },
    toggleMenu: function() {
      this.$emit("toggleMenu", true);
    },
    handleLoadSubscription: function(index) {
      this.loadedSubscriptionIndex = index;
      this.showNewSubForm = false;
      this.$emit("showItem");
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
  .subscription-preview-card {
    $card-height: 48px;

    display: flex;
    align-items: center;
    height: $card-height;
    line-height: $card-height;
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    transition: transform 80ms ease-in-out;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .name {
      flex: auto;
      max-width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .date {
      font-size: 0.7em;
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
      flex-basis: 92px;
      flex-shrink: 0;

      &::before {
        content: '$';
        font-size: 0.7em;
        opacity: 0.4;
        letter-spacing: 3px;
      }
    }

    .color {
      flex-basis: 32px;
      padding-left: 12px;

      div {
        $size: 12px;

        width: $size;
        height: $size;
        border-radius: $size / 2;
      }
    }
  }

  .subscription-line {
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
  }

  &.selected {
    .subscription-preview-card {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .subscription-line {
      visibility: hidden;
    }
  }

  &:hover {
    .subscription-line {
      visibility: hidden;
    }
  }
}

.header {
  display: flex;
  margin-bottom: 2rem;
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
    color: green;
    margin-bottom: 2rem;
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
    background-color: green;
    border-radius: 50%;
    padding: 16px;
    color: white;
  }
}
</style>