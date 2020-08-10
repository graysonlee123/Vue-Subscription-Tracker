<template>
  <div v-if="loading" key="spinner" class="spinner-container">
    <i class="spinner"></i>
  </div>
  <div v-else-if="error">There was a problem with that request. Please try again later.</div>
  <div v-else key="form" class="formContainer">
    <div class="formWrapper">
      <h1>{{subscriptionId ? 'Edit Subscription' : 'New Subscription'}}</h1>
      <div class="dividerWrapper">
        <div class="dividerWrapper__line"></div>
      </div>
      <form>
        <!-- Price -->
        <div
          id="price-wrapper"
          class="field-wrapper price-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'price')}"
        >
          <label for="price">
            Price
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'price')"
            >{{formErrors.find(({field}) => field ==='price').msg}}</span>
          </label>
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
              inputmode="decimal"
              autofocus
            />
          </div>
        </div>
        <!-- Name -->
        <div
          class="field-wrapper name-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'name')}"
        >
          <label for="name">
            Name
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'name')"
            >{{formErrors.find(({field}) => field ==='name').msg}}</span>
          </label>
          <div class="input-wrapper">
            <input id="name" type="text" placeholder="e.g. Spotify" v-model="subscription.name" />
          </div>
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
        <div class="dividerWrapper">
          <div class="dividerWrapper__line"></div>
        </div>
        <!-- Payment Date -->
        <div
          class="field-wrapper date-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'firstPaymentDate')}"
        >
          <label for="firstPaymentDate">
            First Payment
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'firstPaymentDate')"
            >{{formErrors.find(({field}) => field ==='firstPaymentDate').msg}}</span>
          </label>
          <div class="input-wrapper">
            <date-picker
              :date="subscription.firstPaymentDate"
              :color="subscription.color"
              @dateUpdated="(data) => subscription.firstPaymentDate = data"
            ></date-picker>
          </div>
        </div>
        <!-- Interval and Duration-->
        <div
          class="field-wrapper interval-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'interval')}"
        >
          <label for="interval">
            Payment Interval
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'interval')"
            >{{formErrors.find(({field}) => field ==='interval').msg}}</span>
          </label>
          <div class="input-wrapper splitInput">
            <input
              id="interval"
              type="number"
              default="1"
              v-model="subscription.interval"
              inputmode="numeric"
            />
            <select name="duration" id="duration" v-model="subscription.duration">
              <option value="day">Day{{subscription.interval > 1 ? 's' : ''}}</option>
              <option value="month">Month{{subscription.interval > 1 ? 's' : ''}}</option>
              <option value="year">Year{{subscription.interval > 1 ? 's' : ''}}</option>
            </select>
          </div>
        </div>
        <!-- Color -->
        <div
          class="field-wrapper color-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'color')}"
        >
          <label for="color">
            Color
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'color')"
            >{{formErrors.find(({field}) => field ==='color').msg}}</span>
          </label>
          <div class="input-wrapper">
            <color-picker :colorProp="subscription.color" v-on:pickedAColor="handleColorPick" />
          </div>
        </div>
        <!-- Payment Method -->
        <div
          class="field-wrapper method-wrapper"
          :class="{hasError: formErrors.find(({field}) => field === 'paymentMethod')}"
        >
          <label for="paymentMethod" class="optional">
            Payment Method
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'paymentMethod')"
            >{{formErrors.find(({field}) => field ==='paymentMethod').msg}}</span>
          </label>
          <div class="input-wrapper">
            <input
              id="paymentMethod"
              type="text"
              placeholder="e.g. Checking Account"
              v-model="subscription.paymentMethod"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="submitWrapper">
      <button @click="handleSubmit()">
        <i class="fa fa-save"></i> Save Subscription
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { formErrors } from "../../mixins/formErrors";

import { EventBus } from "../../EventBus";

import DatePicker from "./DatePicker.vue";
import ColorPicker from "./ColorPicker";

export default {
  props: {
    subscriptionId: {
      type: String,
    },
  },
  data: function () {
    return {
      loading: true,
      error: false,
      subscription: {
        name: "",
        description: "",
        interval: "1",
        duration: "month",
        paymentMethod: "",
        note: "",
        color: "",
        firstPaymentDate: "",
      },
      formErrors: [],
      showColorModal: false,
      postAsNew: false,
    };
  },
  mixins: [formErrors],
  methods: {
    fetchSubscription: async function () {
      this.loading = true;
      this.subscription = null;

      try {
        const req = await this.$http.get(
          `/api/subscription/${this.subscriptionId}`
        );

        this.subscription = req.data.subscription;
        this.loading = false;
      } catch (err) {
        this.error = true;
        this.loading = false;

        console.log(err);
      }
    },
    handleSubmit: async function () {
      this.formErrors = [];
      this.loading = true;

      // TODO: Make this more DRY
      try {
        if (this.postAsNew) {
          const data = {
            ...this.subscription,
          };

          const res = await this.$http.post("/api/subscription", data);

          this.loading = false;
          EventBus.$emit("refreshSubscriptions");
          this.$router.push(`/dashboard`);
        } else {
          const data = {
            ...this.subscription,
          };

          const res = await this.$http.post(
            `/api/subscription/${this.subscriptionId}`,
            data
          );

          this.loading = false;
          EventBus.$emit("refreshSubscriptions");
          this.$router.push(`/dashboard`);
        }
      } catch (err) {
        this.loading = false;
        this.addFormError(err);

        console.log(err);
      }
    },
    decodeHtml: function (html) {
      let txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },
    handlePriceBlur: function () {
      this.subscription.price = parseFloat(this.subscription.price).toFixed(2);
    },
    handleColorPick: function (color) {
      this.subscription.color = color;
    },
    handleGoBack: async function () {
      try {
        this.$router.push("/app/dashboard");
      } catch (error) {
        console.log(err);
      }
    },
  },
  created: function () {
    // Detect id to know if we are serving a blank form or a populated form
    if (this.subscriptionId) {
      this.fetchSubscription();
    } else {
      this.loading = false;
      this.postAsNew = true;
    }
  },
  components: {
    datePicker: DatePicker,
    colorPicker: ColorPicker,
  },
};
</script>

<style lang="scss" scoped>
.formContainer {
  max-height: 100%;
  width: 100%;
  max-width: 596px;
  margin: 2em auto;
  display: flex;
  flex-flow: column nowrap;

  .formWrapper {
    overflow-y: auto;
    border-radius: var(--borderRadius);
    background-color: var(--containerBackground);
    width: 100%;
    padding: 2em;
    flex-grow: 1;
    margin-bottom: 2em;
  }

  .submitWrapper {
    text-align: center;

    button {
      background: none;
      background-color: var(--success);
      border: none;
      border-radius: 50px;
      padding: 12px 28px;
      color: #eef6ed;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: bold;
    }
  }
}

div.dividerWrapper {
  margin-left: -2em;
  margin-right: -2em;
  grid-column: 1 / 3;

  .dividerWrapper__line {
    border-top: 3px solid var(--bodyBackground);
    margin: 2em 0;
  }
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 1em;
  grid-column-gap: 1em;
  max-width: 100%;

  .fieldError {
    color: var(--danger);
  }

  .input-wrapper.splitInput {
    display: flex;
    justify-content: space-between;

    input {
      max-width: 80px;
    }

    select {
      flex-grow: 1;
      margin-left: 1em;
    }
  }
}

.field-wrapper {
  label {
    display: block;
    margin-bottom: 0.8em;
    color: var(--textLight);
    font-size: 0.8em;
    font-weight: bold;
    padding-left: 1.6em;

    &.optional:after {
      content: " - optional";
      color: inherit;
      font-weight: normal;
    }
  }

  &.desc-wrapper {
    grid-column: 1 / 3;
  }

  &.hasError {
    input {
      border-color: var(--danger);
    }
  }

  &.submit-wrapper {
    text-align: center;

    #submit-btn {
      font-size: 0.8rem;
      padding: 1.3em 2em;
      border-radius: 4em;
      border: none;
      box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.3);
      background: none;
      background-color: #444;
      color: #fff;
      cursor: pointer;

      i {
        margin-right: 0.4em;
        font-size: 1.2em;
      }
    }
  }
}
</style>