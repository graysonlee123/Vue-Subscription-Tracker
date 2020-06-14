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
          >
            <span class="name">{{subscription.name || "No name"}}</span>
            <span class="price">{{subscription.price}}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="right">
      <addSubscriptionForm />
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
      subscriptions: []
    };
  },
  methods: {
    handleMenuToggle: function() {
      EventBus.$emit("showMobileMenu");
    }
  },
  components: {
    addSubscriptionForm: AddSubscriptionForm
  },
  created: async function() {
    try {
      const res = await axios.get("http://localhost:3000/api/subscription");
      const subscriptions = res.data.subscriptions;

      console.log(subscriptions);

      if (!subscriptions) {
      }

      this.subscriptions.push(...subscriptions);
      this.isLoading = false;
    } catch (err) {}
  }
};
</script>

<style scoped lang="scss">
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
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