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
      </div>
      <div class="subscription-list">
        <div v-if="isLoading">Spinner</div>
        <div v-else>
          <div
            class="subscription-preview-card"
            v-for="(subscription, index) in subscriptions"
            :key="index"
            @click="handleLoadSubscription(index)"
            :class="{ selected: loadedSubscriptionIndex === index }"
          >
            <span class="name">{{subscription.name}}</span>
            <span class="price">{{subscription.price.$numberDecimal}}</span>
            <span class="color">
              <div class="color-el" :style="{backgroundColor: subscription.color}"></div>
            </span>
          </div>
        </div>
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
      this.$emit('showItem');
    },
    toggleMenu: function() {
      this.$emit("toggleMenu", true);
    },
    handleLoadSubscription: function(index) {
      this.loadedSubscriptionIndex = index;
      this.showNewSubForm = false;
      this.$emit('showItem');
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
.subscription-preview-card {
  $card-height: 48px;

  display: flex;
  align-items: center;
  height: $card-height;
  line-height: $card-height;
  border-radius: 4px;
  padding: 0 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: transform 80ms ease-in-out;
  border-bottom: 1px solid grey;

  &.selected {
    background-color: rgba(0, 0, 0, 0.1);
    border-bottom: none;
  }

  .name {
    flex: auto;
  }

  .price {
    font-size: 0.8em;
    font-weight: bold;
    max-width: 200px;
    text-align: right;
  }

  .color {
    padding-left: 8px;

    div {
      $size: 12px;

      width: $size;
      height: $size;
      border-radius: $size / 2; 
    }
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