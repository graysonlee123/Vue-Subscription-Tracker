<template>
  <div>
    <div id="left">
      <div class="new-subscription-wrapper">
        <div class="add-subscription-button" @click="handleAddNewForm">
          <i class="fas fa-plus"></i>
        </div>
      </div>
      <div class="header">
        <span id="show-menu-btn" @click="handleShowMenu">
          <i class="fa fa-bars"></i>
        </span>
        <h2>Subscriptions</h2>
      </div>
      <div class="subscription-list">
        <div v-if="isLoading">Spinner</div>
        <div v-else>
          <div
            class="subscription-preview-card"
            v-for="(subscription, index) in subscriptions"
            :key="index"
            @click="handleLoadSubscription(index)"
            :style="{ backgroundColor: subscription.color }"
          >
            <span class="name">{{subscription.name}}</span>
            <span class="price">{{subscription.price}}</span>
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
      this.$emit('showForm');
    },
    handleShowMenu: function() {
      this.$emit("showNav", true);
    },
    handleLoadSubscription: function(index) {
      this.loadedSubscriptionIndex = index;
      this.showNewSubForm = false;
      this.$emit('showForm');
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
  cursor: pointer;
  transition: transform 80ms ease-in-out;

  &:hover {
    transform: scale(1.03);
  }
}

.subscription-preview-card {
  $card-height: 48px;

  display: flex;
  align-items: center;
  background-color: green;
  height: $card-height;
  line-height: $card-height;
  border: 1px solid grey;
  border-radius: 4px;
  padding: 0 12px;
  margin-bottom: 8px;

  .name {
    flex: auto;
  }

  .price {
    max-width: 200px;
    text-align: right;
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