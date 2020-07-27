<template>
  <div v-if="loading" key="spinner" class="spinner-container">
    <i class="spinner"></i>
  </div>
  <div v-else-if="error">There was a problem with that request. Please try again later.</div>
  <div v-else key="form" class="form-container">
    <form @submit.prevent="handleSubmit">
      <!-- Price -->
      <div
        id="price-wrapper"
        class="field-wrapper price-wrapper"
        :style="{backgroundColor: subscription.color}"
      >
        <div class="back-arrow" @click="handleGoBack">
          <i class="fa fa-arrow-left"></i>
        </div>
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
            inputmode="decimal"
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
          <date-picker
            :date="subscription.firstPaymentDate"
            :color="subscription.color"
            @dateUpdated="(data) => subscription.firstPaymentDate = data"
          ></date-picker>
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
          <input id="interval" type="number" default="1" v-model="subscription.interval" inputmode="numeric" />
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
          <div class="color-picker-wrapper">
            <div
              class="color-picker"
              @click="toggleColorModal()"
              :style="{backgroundColor: subscription.color}"
            >Pick a Color</div>
            <div class="color-modal" :class="{active: showColorModal}">
              <ul>
                <li
                  v-for="(color, index) in colors"
                  :key="index"
                  :style="{backgroundColor: color}"
                  @click="pickColor(color);"
                ></li>
              </ul>
            </div>
          </div>
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({field}) => field === 'color')"
        >{{formErrors.find(({field}) => field ==='color').msg}}</p>
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
        <button id="submit-btn" type="submit" :style="{backgroundColor: subscription.color}">
          <i class="fa fa-save"></i> Save Subscription
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import { formErrors } from "../../mixins/formErrors";

import DatePicker from "./DatePicker.vue";

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
        color: "#0d8ace",
        firstPaymentDate: ''
      },
      formErrors: [],
      showColorModal: false,
      colors: [
        "#f57700",
        "#f8c610",
        "#77dcb1",
        "#11e17b",
        "#89cffa",
        "#0d8ace",
        "#9daba9",
        "#da054e",
        "#e36e9e",
        "#8b00ef",
      ],
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
          this.$emit("refreshSubscriptions");
          this.$router.push(
            `/app/dashboard/subscription/view/${res.data.subscription._id}`
          );
        } else {
          const data = {
            ...this.subscription,
          };

          const res = await this.$http.post(
            `/api/subscription/${this.subscriptionId}`,
            data
          );

          this.loading = false;
          this.$emit("refreshSubscriptions");
          this.$router.push(
            `/app/dashboard/subscription/view/${this.subscriptionId}`
          );
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
    toggleColorModal: function (bool) {
      switch (bool) {
        case true: {
          this.showColorModal = true;
          break;
        }
        case false: {
          this.showColorModal = false;
          break;
        }
        default: {
          this.showColorModal
            ? (this.showColorModal = false)
            : (this.showColorModal = true);
          break;
        }
      }
    },
    pickColor: function (color) {
      this.subscription.color = color;
    },
    handleGoBack: async function () {
      try {
        this.$router.push('/app/dashboard');
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
      this.subscription.color = this.colors[
        Math.floor(Math.random() * this.colors.length)
      ];
    }
  },
  components: {
    datePicker: DatePicker,
  },
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

  .field-error {
    margin-top: 0.2em;
    color: #ff9f9f;
    background-color: rgb(169, 53, 53);
    padding: 0.6em;
    border-radius: 5px;
    font-size: 0.9em;
    text-transform: capitalize;
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
  .color-picker,
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

  .color-picker-wrapper {
    position: relative;
    user-select: none;

    .color-picker {
      cursor: pointer;
      padding-top: 0;
      padding-bottom: 0;
      line-height: 44px;
    }

    .color-modal {
      position: absolute;
      top: 60px;
      left: 0;
      width: 300px;
      background-color: #444;
      padding: 1em;
      border-radius: 5px;
      box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.3);
      display: none;

      &.active {
        display: block;
      }

      ul {
        display: flex;
        flex-flow: row wrap;

        li {
          $size: 22px;
          width: $size;
          height: $size;
          border-radius: 50%;
          margin: 6px;
          cursor: pointer;
          transition: 300ms ease-in-out;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
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

#price-wrapper {
  width: 100%;
  height: 200px;
  background-color: #333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  label {
    display: none;
  }

  .field-error {
    margin-top: 1em;
  }

  .back-arrow {
    position: absolute;
    top: 24px;
    left: 24px;
    font-size: 1.2em;
    display: none;
    cursor: pointer;

    @media screen and (max-width: 767px) {
      display: block;
    }
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