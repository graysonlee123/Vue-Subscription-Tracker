<template>
  <div class="hello">
    <h1>Dashboard</h1>
    <h2>Welcome to your dashboard, {{email}}</h2>
    <p>Here, you will see all of your subscriptions. Sort, edit, and more</p>
    <div class="subscription-list">
      <div v-if="isLoading">Spinner</div>
      <div v-else>
        <div class="subscription-preview-card" v-for="(subscription, index) in subscriptions" :key="index">
          <span class="name">
            {{subscription.name || "No name"}}
          </span>
          <span class="price">
            {{subscription.price}}
          </span>
        </div>
      </div>
    </div>
    <addSubscriptionForm />
  </div>
</template>

<script>
import AddSubscriptionForm from "./AddSubscriptionForm";
import axios from "axios";

export default {
  data: function() {
    return {
      msg: "the commoners",
      isLoading: true,
      subscriptions: []
    };
  },
  components: {
    addSubscriptionForm: AddSubscriptionForm
  },
  computed: {
    email() {
      return this.$store.state.user.email;
    }
  },
  created: async function() {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/subscription"
      );
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
</style>