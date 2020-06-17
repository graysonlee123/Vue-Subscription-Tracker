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
    <!-- Payment -->
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
        <select name="duration" id="duration">
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
    <!-- Note -->
    <div class="field-wrapper">
      <label for="note">Note</label>
      <div class="input-wrapper">
        <input id="note" type="text" placeholder="Watch movies and TV" v-model="subscription.note" />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <!-- Submit -->
    <div class="field-wrapper">
      <button type="submit">Update</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    subscriptionProp: {
      type: Object,
      required: true
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
        note: "",
        _id: ""
      },
      formErrors: []
    };
  },
  methods: {
    updateFromProps: function() {
      this.subscription.price = this.subscriptionProp.price;
      this.subscription.name = this.subscriptionProp.name;
      this.subscription.description = this.subscriptionProp.description;
      this.subscription.firstPaymentDate = this.subscriptionProp.firstPaymentDate;
      this.subscription.interval = this.subscriptionProp.interval;
      this.subscription.duration = this.subscriptionProp.duration;
      this.subscription.paymentMethod = this.subscriptionProp.paymentMethod;
      this.subscription.note = this.subscriptionProp.note;
      this.subscription._id = this.subscriptionProp._id;
    },
    handleSubmit: function() {
      console.log("submit to subscription id ", this.subscription._id);
    }
  },
  watch: {
    subscriptionProp: function() {
      this.updateFromProps();
      console.log("update");
    }
  },
  created: function() {
    this.updateFromProps();
  }
};
</script>