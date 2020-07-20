<template>
<div class="form-container">
  <form @submit.prevent="handleSubmit">
    <!-- Price -->
    <div
      id="price-wrapper"
      class="field-wrapper price-wrapper"
      :style="{backgroundColor: subscription.color}"
    >
      <label for="price">Price</label>
      <div class="input-wrapper">
        <input
          id="price"
          type="number"
          step="0.01"
          min="0.00"
          max="999.00"
          placeholder="0.00"
          v-model="subscription.price"
          v-on:blur="handlePriceBlur"
          autofocus
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'price')"
      >{{formErrors.find(({field}) => field ==='price').msg}}</p>
    </div>
    <!-- Name -->
    <div class="field-wrapper name-wrapper">
      <label for="name">Name</label>
      <div class="input-wrapper">
        <input id="name" type="text" placeholder="e.g. Spotify" v-model="subscription.name" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'name')"
      >{{formErrors.find(({field}) => field ==='name').msg}}</p>
    </div>
    <!-- Description -->
    <div class="field-wrapper desc-wrapper">
      <label for="description" class="optional">Description</label>
      <div class="input-wrapper">
        <input
          id="description"
          type="text"
          placeholder="e.g. Student plan"
          v-model="subscription.description"
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'description')"
      >{{formErrors.find(({field}) => field ==='description').msg}}</p>
    </div>
    <!-- Divider -->
    <div class="field-wrapper">
      <hr class="divider" />
    </div>
    <!-- Payment Date -->
    <div class="field-wrapper date-wrapper">
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
    <div class="field-wrapper interval-wrapper">
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
    <div class="field-wrapper duration-wrapper">
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
    <!-- Divider -->
    <div class="field-wrapper">
      <hr class="divider" />
    </div>
    <!-- Color -->
    <div class="field-wrapper color-wrapper">
      <label for="color">Color</label>
      <div class="input-wrapper">
        <input id="color" type="color" v-model="subscription.color" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <!-- Payment Method -->
    <div class="field-wrapper method-wrapper">
      <label for="paymentMethod" class="optional">Payment Method</label>
      <div class="input-wrapper">
        <input
          id="paymentMethod"
          type="text"
          placeholder="e.g. Checking Account"
          v-model="subscription.paymentMethod"
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'paymentMethod')"
      >{{formErrors.find(({field}) => field ==='paymentMethod').msg}}</p>
    </div>
    <!-- Note -->
    <div class="field-wrapper note-wrapper">
      <label for="note" class="optional">Note</label>
      <div class="input-wrapper">
        <input
          id="note"
          type="text"
          placeholder="e.g. Student discount"
          v-model="subscription.note"
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <!-- Submit -->
    <div class="field-wrapper submit-wrapper">
      <button type="submit">{{this.isNewSubscription ? 'Add Subscription' : 'Update'}}</button>
    </div>
  </form>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";

import { formErrors } from "../../mixins/formErrors";

export default {
  props: {
    subscriptionProp: {
      type: Object
    },
    index: {
      type: Number
    }
  },
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
          this.$emit("fetchSubscriptions", post.data.subscription._id);
        } else {
          const update = await axios.post(
            `http://localhost:3000/api/subscription/${this.subscriptionProp._id}`,
            data
          );
          this.$emit("fetchSubscriptions", update.data.subscription._id);
        }
      } catch (err) {
        console.log(err);
        this.addFormError(err, "price");
      }
    },
    handlePriceBlur: function() {
      this.subscription.price = parseFloat(this.subscription.price).toFixed(2);
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

<style lang="scss" scoped>
.form-container {
  height: 100%;
  overflow-y: auto;
}

form {
  font-size: 1rem;
  display: grid;
  grid-template-columns: 3fr 6fr;
  grid-row-gap: 1em;
  grid-column-gap: 1em;
  max-width: 100%;
  margin: 2em;

  .field-wrapper {
    grid-column: 1 / 3;
  }

  .interval-wrapper {
    grid-column: 1 / 2;
  }

  .duration-wrapper {
    grid-column: 2 / 3;
  }

  .divider {
    border-bottom: none;
    border-top-width: 1px;
    border-color: rgba(255, 255, 255, 0.3);
    margin: 0;
  }
}

.field-wrapper {
  label {
    display: block;
    margin-bottom: 0.4em;
    color: #888;
    font-size: 0.8em;
    font-weight: bold;

    &.optional:after {
      content: " - optional";
      color: #444;
      font-weight: normal;
    }
  }

  input[type="text"],
  input[type="number"],
  select {
    $height: 44px;

    width: 100%;
    border: none;
    padding: 0.8em;
    font-size: 0.8em;
    background-color: #333;
    color: #eee;
    border-radius: 5px;
    height: $height;
    line-height: $height;

    &:focus {
      outline: none;
    }
  }

  input[type="number"] {
    // Chrome, safari, edge, opera
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    -moz-appearance: textfield;

    &::-webkit-input-placeholder {
      color: transparentize($color: #eee, $amount: 0.5);
    }
  }
}

#price-wrapper {
  width: 100%;
  height: 200px;
  background-color: #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  label {
    display: none;
  }

  .input-wrapper {
    width: 240px;
    padding: 0 16px;

    input {
      width: 100%;
      height: auto;
      text-align: center;
      background: none;
      border: none;
      font-size: 3em;
      color: #eee;
      padding: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>