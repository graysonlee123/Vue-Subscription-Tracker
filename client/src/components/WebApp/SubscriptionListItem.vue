<template>
  <li class="subscriptionListItem">
    <div class="flexChild color">
      <div class="color__swatch" :style="{borderColor: subscription.color}"></div>
    </div>
    <div class="flexChild textContainer name">{{subscription.name}}</div>
    <div class="flexChild textContainer price">${{subscription.price}}</div>
    <div class="flexChild textContainer paidToDate">${{subscription.paidToDate}}</div>
    <div class="flexChild textContainer billingPeriod">{{billingPeriod}}</div>
    <div
      class="flexChild textContainer paymentMethod"
    >{{subscription.paymentMethod || 'None provided'}}</div>
    <div class="flexChild tags">
      <span class="tag">productibity</span>
      <span class="tag">media</span>
      <span class="tag">essential</span>
    </div>
    <div
      class="flexChild textContainer firstPayment"
    >{{subscription.firstPaymentDate | moment("MMMM DD, YYYY")}}</div>
    <div
      class="flexChild textContainer nextPayment"
    >{{subscription.upcomingPayments[0].fromNow}} ({{subscription.upcomingPayments[0].momentDate | moment("MMMM DD, YYYY")}})</div>
    <div class="flexChild options">
      <div
        class="options__clickZone"
        :class="{options__clickZone_active: showOptions}"
        @click="handleOptionsMenu()"
      >
        <i class="fas fa-ellipsis-h"></i>
      </div>
      <ul class="optionsMenu" v-if="showOptions">
        <router-link :to="`/dashboard/subscription/${subscription._id}`" tag="li">
          <i class="fa fa-pencil"></i> Edit
        </router-link>
        <li @click="handleRemoveSubscription()">
          <i class="fa fa-trash"></i> Remove
        </li>
        <li @click="handleDuplicateSubscription()">
          <i class="fa fa-copy"></i> Duplicate
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
import moment from "moment";
import { EventBus } from "../../EventBus";

export default {
  props: {
    subscription: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      showOptions: false,
    };
  },
  methods: {
    handleRemoveSubscription: async function () {
      try {
        const req = await this.$http.delete(
          `/api/subscription/${this.subscription._id}`
        );

        // this.$emit("refreshSubscriptions");
        EventBus.$emit("refreshSubscriptions");
        this.$router.push("/dashboard");
      } catch (err) {
        console.log(err);
      }
    },
    handleDuplicateSubscription: async function () {
      try {
        const subscriptionReq = {
          price: this.subscription.price,
          name: this.subscription.name,
          description: this.subscription.description,
          firstPaymentDate: this.subscription.firstPaymentDate,
          interval: this.subscription.interval,
          duration: this.subscription.duration,
          color: this.subscription.color,
          paymentMethod: this.subscription.paymentMethod,
          note: this.subscription.note,
        };

        const req = await this.$http.post(
          `/api/subscription/`,
          subscriptionReq
        );

        EventBus.$emit("refreshSubscriptions");

        // TODO: Reroute to edit this subscription
        this.$router.push(`/dashboard/subscription/${req.data.subscription._id}`);
      } catch (err) {
        console.log(err);
      }
    },
    handleOptionsMenu: function (bool) {
      if (typeof bool === "boolean") {
        // Menu logic if a specific option is passed
      } else {
        // Just toggle the menu
        this.showOptions
          ? (this.showOptions = false)
          : (this.showOptions = true);
      }
    },
  },
  computed: {
    billingPeriod: function () {
      if (this.subscription.interval > 1) {
        return `Every ${this.subscription.interval} ${this.subscription.duration}s`;
      } else {
        switch (this.subscription.duration) {
          case "day": {
            return `Daily`;
            break;
          }
          case "year": {
            return `Yearly`;
            break;
          }
          case "month": {
            return `Monthly`;
            break;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 62px;

.subscriptionListItem {
  display: flex;
  background-color: var(--containerBackground);
  margin-bottom: 16px;
  height: $height;
  line-height: $height;
  border-radius: var(--borderRadius);
  white-space: nowrap;
  box-shadow: 0px 4px 4px rgba(43, 46, 51, 0.05);

  &:hover {
    background-color: #ebf7fc;
  }

  .flexChild:not(:last-child) {
    padding-right: 12px;
  }

  .textContainer {
    flex-grow: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .color {
    flex-basis: $height;
    text-align: center;
    flex-shrink: 0;
    display: grid;
    place-items: center;

    .color__swatch {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid white;
      border-radius: 50%;
    }
  }

  .name {
    flex-basis: 140px;
  }

  .price {
    flex-basis: 100px;
    font-weight: bold;
  }

  .paidToDate {
    flex-basis: 120px;
  }

  .billingPeriod {
    flex-basis: 140px;
  }

  .paymentMethod {
    flex-basis: 150px;
  }

  .tags {
    flex-basis: 100px;
    flex-grow: 1;

    .tag {
      background-color: #E9F7EC;
      padding: 12px 16px;
      font-size: 70%;
      border-radius: var(--borderRadius);
      cursor: pointer;
      box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.07);
    }
  }

  .firstPayment {
    flex-basis: 200px;
  }

  .nextPayment {
    flex-basis: 260px;
  }

  .options {
    flex-basis: $height;
    display: grid;
    place-items: center;
    position: relative;

    div.options__clickZone {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      cursor: pointer;

      &:hover,
      &.options__clickZone_active {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    ul.optionsMenu {
      position: absolute;
      right: 0;
      top: 48px;
      background: var(--containerBackground);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
      z-index: 2;
      border-radius: var(--borderRadius);

      li {
        padding: 1em 2em;
        line-height: 0.2;
        cursor: pointer;

        &:hover {
          background-color: rgba($color: #000000, $alpha: 0.05);
        }

        i {
          padding-right: 0.8em;
        }
      }
    }
  }
}
</style>