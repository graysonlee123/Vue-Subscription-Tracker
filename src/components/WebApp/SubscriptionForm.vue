<template>
  <form @submit.prevent="handleSubmit">
    <!-- Price -->
    <div class="field-wrapper">
      <label for="price">Price</label>
      <div class="input-wrapper">
        <input
          id="price"
          type="number"
          step="0.01"
          placeholder="19.99"
          v-model="subscription.price"
          autofocus
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'price')"
      >{{formErrors.find(({field}) => field ==='price').msg}}</p>
    </div>
    <!-- Name -->
    <div class="field-wrapper">
      <label for="name">Name</label>
      <div class="input-wrapper">
        <input id="name" type="text" placeholder="Netflix" v-model="subscription.name" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'name')"
      >{{formErrors.find(({field}) => field ==='name').msg}}</p>
    </div>
    <!-- Description -->
    <div class="field-wrapper">
      <label for="description">Description</label>
      <div class="input-wrapper">
        <input
          id="description"
          type="text"
          placeholder="Watch movies and TV"
          v-model="subscription.description"
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'description')"
      >{{formErrors.find(({field}) => field ==='description').msg}}</p>
    </div>
    <!-- Payment Date -->
    <div class="field-wrapper">
      <label for="firstPaymentDate">First Payment</label>
      <div class="input-wrapper">
        <input id="firstPaymentDate" type="date" v-model="subscription.firstPaymentDate" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'firstPaymentDate')"
      >{{formErrors.find(({field}) => field ==='firstPaymentDate').msg}}</p>
    </div>
    <!-- Interval -->
    <div class="field-wrapper">
      <label for="interval">Interval</label>
      <div class="input-wrapper">
        <input id="interval" type="number" default="1" v-model="subscription.interval" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'interval')"
      >{{formErrors.find(({field}) => field ==='interval').msg}}</p>
    </div>
    <!-- Duration -->
    <div class="field-wrapper">
      <label for="duration">Duration</label>
      <div class="input-wrapper">
        <select name="duration" id="duration" v-model="subscription.duration">
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'duration')"
      >{{formErrors.find(({field}) => field ==='duration').msg}}</p>
    </div>
    <!-- Payment Method -->
    <div class="field-wrapper">
      <label for="paymentMethod">Payment Method</label>
      <div class="input-wrapper">
        <input
          id="paymentMethod"
          type="text"
          placeholder="Checking Account"
          v-model="subscription.paymentMethod"
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'paymentMethod')"
      >{{formErrors.find(({field}) => field ==='paymentMethod').msg}}</p>
    </div>
    <!-- Color -->
    <div class="field-wrapper">
      <label for="color">Color</label>
      <div class="input-wrapper">
        <input id="color" type="color" v-model="subscription.color" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <!-- Note -->
    <div class="field-wrapper">
      <label for="note">Note</label>
      <div class="input-wrapper">
        <input id="note" type="text" placeholder="Student discount" v-model="subscription.note" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <!-- Submit -->
    <div class="field-wrapper">
      <button type="submit">{{this.isNewSubscription ? 'Add Subscription' : 'Update'}}</button>
    </div>
    <!-- Delete -->
    <div v-if="!isNewSubscription" @click="handleConfirmDelete">
      <i class="fa fa-trash"></i>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import moment from "moment";

import { formErrors } from "../../mixins/formErrors";

export default {
  props: ["subscriptionProp"],
  data: function() {
    return {
      subscription: {
        price: null,
        name: "",
        description: "",
        firstPaymentDate: "",
        interval: null,
        duration: "",
        paymentMethod: "",
        color: "",
        note: ""
      },
      formErrors: [],
      isNewSubscription: false
    };
  },
  mixins: [formErrors],
  methods: {
    decodeHtml: function(html) {
      let txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },
    updateFromProps: function() {
      if (!this.subscriptionProp) {
        this.isNewSubscription = true;
        this.subscription = {
          price: null,
          name: "",
          description: "",
          firstPaymentDate: this.parseDate(Date.now()),
          interval: 1,
          duration: "month",
          paymentMethod: "",
          color: "#3f5cee",
          note: ""
        };
      } else {
        this.isNewSubscription = false;

        this.subscription.price = this.subscriptionProp.price.$numberDecimal;
        this.subscription.name = this.subscriptionProp.name;
        this.subscription.description = this.subscriptionProp.description;
        this.subscription.firstPaymentDate = this.parseDate(
          this.subscriptionProp.firstPaymentDate
        );
        this.subscription.interval = this.subscriptionProp.interval;
        this.subscription.duration = this.subscriptionProp.duration;
        this.subscription.paymentMethod = this.subscriptionProp.paymentMethod;
        this.subscription.color = this.subscriptionProp.color;
        this.subscription.note = this.decodeHtml(this.subscriptionProp.note);
      }
    },
    parseDate: function(dateString) {
      // Expects an ISO date string
      const date = moment(dateString);

      return date.format("YYYY-MM-DD");
    },
    handleSubmit: async function() {
      this.clearErrors();

      try {
        const data = {
          ...this.subscription
        };

        if (this.isNewSubscription) {
          const post = await axios.post(
            "http://localhost:3000/api/subscription",
            data
          );
        } else {
          const update = await axios.post(
            `http://localhost:3000/api/subscription/${this.subscriptionProp._id}`,
            data
          );
        }

        this.$emit("getSubscriptions");
      } catch (err) {
        console.log(err);
        this.addFormError(err, "price");
      }
    },
    handleConfirmDelete: async function() {
      if (!confirm("Are you sure? Deleting a subscription is permanent.")) return;

      try {
        const subscription = await axios.delete(
          `http://localhost:3000/api/subscription/${this.subscriptionProp._id}`
        );

        this.$emit("getSubscriptions");
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    subscriptionProp: function() {
      this.updateFromProps();
    }
  },
  created: function() {
    this.updateFromProps();
  }
};
</script>