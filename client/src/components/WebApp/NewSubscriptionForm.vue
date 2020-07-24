<template>
  <div class="form-container">
    <transition name="fade-up" mode="out-in">
      <div v-if="isLoading" class="spinner-container">
        <i class="spinner"></i>
      </div>
      <form v-else @submit.prevent="postSubscription">
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
          <button type="submit">Add Subscription</button>
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { formErrors } from "../../mixins/formErrors";

export default {
  data: function () {
    return {
      isLoading: false,
      subscription: {
        price: "",
        name: "",
        description: "",
        firstPaymentDate: "",
        interval: "1",
        duration: "month",
        color: '#f57700',
        paymentMethod: "",
        note: "",
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
    };
  },
  mixins: [formErrors],
  methods: {
    postSubscription: async function () {
      this.formErrors = [];
      this.isLoading = true;

      try {
        const data = {
          ...this.subscription,
        };

        const res = await axios.post(`/api/subscription/`, data);

        this.isLoading = false;

        this.$emit("refreshSubscriptions");
        this.$router.push(
          `/app/dashboard/subscription/${res.data.subscription._id}`
        );
      } catch (err) {
        console.log(err);
        this.isLoading = false;
        this.addFormError(err, "price");
      }
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

.fade-up-enter-active,
.fade-up-leave-active {
  transition: transform 200ms ease, opacity 100ms ease;
}

.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
}

.fade-up-enter-to,
.fade-up-leave {
  opacity: 1;
}
</style>