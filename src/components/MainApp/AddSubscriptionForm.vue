<template>
  <form @submit.prevent="handleSubmit">
    <div class="field-wrapper">
      <label for="price">Price</label>
      <div class="input-wrapper">
        <input id="price" type="text" placeholder="19.99" v-model="price" autofocus />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'price')"
      >{{formErrors.find(({field}) => field ==='price').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="name">name</label>
      <div class="input-wrapper">
        <input id="name" type="text" placeholder="Netflix" v-model="name" autofocus />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'name')"
      >{{formErrors.find(({field}) => field ==='name').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="description">description</label>
      <div class="input-wrapper">
        <input
          id="description"
          type="text"
          placeholder="Watch movies and TV"
          v-model="description"
          autofocus
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'description')"
      >{{formErrors.find(({field}) => field ==='description').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="firstPaymentDate">firstPaymentDate</label>
      <div class="input-wrapper">
        <input id="firstPaymentDate" type="date" v-model="firstPaymentDate" autofocus />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'firstPaymentDate')"
      >{{formErrors.find(({field}) => field ==='firstPaymentDate').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="interval">interval</label>
      <div class="input-wrapper">
        <input id="interval" type="number" default="1" v-model="interval" autofocus />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'interval')"
      >{{formErrors.find(({field}) => field ==='interval').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="duration">duration</label>
      <div class="input-wrapper">
        <input
          id="duration"
          type="select"
          placeholder="Watch movies and TV"
          v-model="duration"
          autofocus
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'duration')"
      >{{formErrors.find(({field}) => field ==='duration').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="paymentMethod">paymentMethod</label>
      <div class="input-wrapper">
        <input
          id="paymentMethod"
          type="select"
          placeholder="Watch movies and TV"
          v-model="paymentMethod"
          autofocus
        />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'paymentMethod')"
      >{{formErrors.find(({field}) => field ==='paymentMethod').msg}}</p>
    </div>
    <div class="field-wrapper">
      <label for="note">note</label>
      <div class="input-wrapper">
        <input id="note" type="text" placeholder="Watch movies and TV" v-model="note" autofocus />
      </div>
      <p
        class="field-error"
        v-if="formErrors.find(({field}) => field === 'note')"
      >{{formErrors.find(({field}) => field ==='note').msg}}</p>
    </div>
    <div class="field-wrapper">
      <button type="submit">Add Subscription</button>
    </div>
  </form>
</template>

<script>
export default {
  data: function() {
    return {
      price: "",
      name: "",
      description: "",
      firstPaymentDate: "",
      interval: 24,
      duration: "day",
      paymentMethod: "",
      note: "",
      formErrors: []
    };
  },
  methods: {
    handleSubmit: function() {
      console.log("submit");
    }
  }
};
</script>