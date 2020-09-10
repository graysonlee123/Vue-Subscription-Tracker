<template>
  <spinner v-if="loading"></spinner>
  <div v-else-if="error">
    There was a problem with that request. Please try again later.
    <router-link to="/dashboard">Go back</router-link>
  </div>
  <div v-else key="form">
    <div class="subscriptionHeader">
      <div class="subscriptionHeader__text">
        <h2>{{postAsNew ? 'New' : 'Edit'}}</h2>
        <a @click="$router.push('/dashboard')">
          <img src="@/assets/close.svg" alt="Close" />
        </a>
      </div>
    </div>
    <div class="col2">
      <number-input
        v-model="subscription.price"
        label="Price"
        step="0.01"
        min="0.00"
        max="999.99"
        placeholder="0.00"
        :errors="formErrors.filter(error => error.field === 'price')"
      ></number-input>
      <text-input
        v-model="subscription.name"
        label="Name"
        placeholder="e.g. Spotify"
        :errors="formErrors.filter(error => error.field === 'name')"
      ></text-input>
    </div>
    <text-input
      v-model="subscription.description"
      label="Description"
      placeholder="e.g. Student plan"
      :errors="formErrors.filter(error => error.field === 'description')"
    ></text-input>
    <div class="divider"></div>
    <date-input
      :value="subscription.firstPaymentDate"
      label="First payment"
      @handle-change="subscription.firstPaymentDate = $event"
      :errors="formErrors.filter(error => error.field === 'firstPaymentDate')"
    ></date-input>
    <div class="col2">
      <number-input
        v-model="subscription.interval"
        label="Interval"
        step="1"
        min="1"
        max="32"
        placeholder="e.g. 1"
        :errors="formErrors.filter(error => error.field === 'interval')"
      ></number-input>
      <select-input
        v-model="subscription.duration"
        label="Duration"
        :errors="formErrors.filter(error => error.field === 'duration')"
        :options="['month', 'day', 'year']"
        :plural="parseInt(subscription.interval) > 1 ? true : false"
      ></select-input>
    </div>
    <div class="divider"></div>
    <div class="col2">
      <color-input
        :value="subscription.color"
        label="Color"
        placeholder="Pick a color"
        @handle-change="subscription.color = $event"
        :errors="formErrors.filter(error => error.field === 'color')"
      ></color-input>
      <text-input
        v-model="subscription.paymentMethod"
        label="Payment method"
        placeholder="e.g. Checking account"
        :errors="formErrors.filter(error => error.field === 'paymentMethod')"
      ></text-input>
    </div>
    <textarea-input
      v-model="subscription.note"
      placeholder="e.g. Couldn't get the student discount"
      :errors="formErrors.filter(error => error.field === 'note')"
      label="Note"
    ></textarea-input>
    <submit-button
      @handle-submit="handleSubmit"
    >{{postAsNew ? 'Add Subscription' : 'Update Subscription'}}</submit-button>
  </div>
</template>

<script>
import moment from "moment";

import { formErrors } from "../../mixins/formErrors";
import { modal } from "../../mixins/modal";

import { EventBus } from "../../EventBus";

import TextInput from "../general/inputs/TextInput";
import NumberInput from "../general/inputs/NumberInput";
import SubmitButton from "../general/inputs/SubmitButton";
import ColorInput from "../general/inputs/ColorInput";
import SelectInput from "../general/inputs/SelectInput";
import DateInput from "../general/inputs/DateInput";
import TextareaInput from "../general/inputs/TextareaInput";
import Spinner from "../general/Spinner";

export default {
  mixins: [formErrors, modal],
  components: {
    TextInput,
    SubmitButton,
    NumberInput,
    ColorInput,
    SelectInput,
    DateInput,
    TextareaInput,
    Spinner,
  },
  props: {
    subscriptionId: {
      type: String,
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      subscription: {
        price: "",
        name: "",
        description: "",
        interval: "",
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
  methods: {
    async fetchSubscription() {
      this.loading = true;
      this.subscription = null;

      try {
        const req = await this.$http.get(
          `/api/subscription/${this.subscriptionId}`
        );

        this.subscription = req.data.subscription;
        this.subscription.price = req.data.subscription.price.toFixed(2);
        this.subscription.interval = req.data.subscription.interval.toString();

        this.loading = false;
      } catch (err) {
        this.error = true;
        this.loading = false;

        this.modal(
          "There was an error loading that subscription. Please try again later.",
          "danger"
        );

        console.log(err);
      }
    },
    async handleSubmit() {
      this.formErrors = [];
      this.loading = true;

      try {
        const data = {
          ...this.subscription,
        };

        const res = await this.$http.post(
          this.postAsNew
            ? `/api/subscription`
            : `/api/subscription/${this.subscriptionId}`,
          data
        );

        this.loading = false;
        EventBus.$emit("refreshSubscriptions");
        this.$router.push("/dashboard");

        this.modal(
          `Your subscription was succesfully ${
            this.postAsNew ? "added" : "updated"
          }.`,
          "success"
        );
      } catch (err) {
        this.loading = false;
        this.addFormError(err);

        console.error(err);
      }
    },
    decodeHtml(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },
    handlePriceBlur() {
      this.subscription.price = parseFloat(this.subscription.price).toFixed(2);
      this.removeFormError("price");
    },
    handleDateUpdate(data) {
      this.subscription.firstPaymentDate = data;
      this.removeFormError("firstPaymentDate");
    },
    handleColorPick(color) {
      this.subscription.color = color;
      this.removeFormError("color");
    },
  },
  created() {
    // Detect id to know if we are serving a blank form or a populated form
    if (this.subscriptionId) {
      this.fetchSubscription();
    } else {
      this.loading = false;
      this.postAsNew = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.subscriptionHeader {
  margin-bottom: 1.6em;
}

.subscriptionHeader__text {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  font-size: 32px;
  color: #8369fe;
}

.col2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .inputGroup {
    flex-basis: 48%;
  }
}

.divider {
  margin-bottom: 1.6em;
  height: 3px;
  background-color: var(--bodyBackground);
}
</style>
