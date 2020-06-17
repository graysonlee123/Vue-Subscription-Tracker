<template>
  <div>
    <div id="left">
      <div class="header">
        <span id="show-menu-btn" @click="handleMenuToggle">
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
          >
            <span class="name">{{subscription.name || "No name"}}</span>
            <span class="price">{{subscription.price}}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="right">
      <div v-if="loadedSubscriptionIndex >= 0">
        <add-subscription-form v-bind:subscriptionProp="subscriptions[loadedSubscriptionIndex]"/>
      </div>
      <div v-else>
        Icon
      </div>
    </div>
  </div>
</template>

<script>
import AddSubscriptionForm from "./AddSubscriptionForm";
import axios from "axios";
import { EventBus } from "../../EventBus";

export default {
  data: function() {
    return {
      msg: "the commoners",
      isLoading: true,
      subscriptions: [],
      loadedSubscriptionIndex: -1
    };
  },
  methods: {
    handleMenuToggle: function() {
      EventBus.$emit("showMobileMenu");
    },
    handleLoadSubscription: function(index) {
      console.log(index);
      this.loadedSubscriptionIndex = index;
    }
  },
  components: {
    addSubscriptionForm: AddSubscriptionForm
  },
  created: async function() {
    try {
      const res = await axios.get("http://localhost:3000/api/subscription");
      const subscriptions = res.data.subscriptions;

      if (!subscriptions) {
        // TODO Redirect to add a subscription
      }

      this.subscriptions.push(...subscriptions);
      this.isLoading = false;
    } catch (err) {
      console.log(err);
    }
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
  $card-height: 64px;

  display: flex;
  align-items: center;
  background-color: green;
  height: $card-height;
  line-height: $card-height;
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

#show-menu-btn {
  display: inline;
}
</style>