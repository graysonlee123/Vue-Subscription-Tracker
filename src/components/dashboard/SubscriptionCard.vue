<template>
  <router-link
    :to="`/subscription/view/${subscription._id}`"
    tag="li"
    class="subscriptionListItem"
    :style="{backgroundColor: subscription.color}"
  >
    <div class="flexChild color">
      <div class="color__swatch" :style="{borderColor: subscription.color}"></div>
    </div>
    <div class="flexChild textContainer name" data-label="Name">{{subscription.name}}</div>
    <div class="flexChild textContainer price" data-label="Price">${{subscription.price}}</div>
    <div
      class="flexChild textContainer paidToDate"
      data-label="Paid to date"
    >${{subscription.paidToDate}}</div>
    <div class="flexChild textContainer billingPeriod" data-label="Billing period">{{billingPeriod}}</div>
    <div
      class="flexChild textContainer paymentMethod"
      data-label="Payment method"
    >{{subscription.paymentMethod || 'None provided'}}</div>
    <div class="flexChild tags" data-label="Tags">
      <span class="tag">tags coming soon</span>
    </div>
    <div
      class="flexChild textContainer firstPayment"
      data-label="First payment"
    >{{firstPaymentDateString}}</div>
    <div
      class="flexChild textContainer nextPayment"
      data-label="Next payment"
    >{{upcomingPaymentString}}</div>
    <div class="flexChild options">
      <div
        class="options__clickZone"
        :class="{options__clickZone_active: showOptions}"
        @click="handleOptionsMenu"
        ref="subscriptionOptionsMenu"
        data-name="showOptions"
      >
        <i class="fas fa-ellipsis-h"></i>
      </div>
      <ul class="optionsMenu" v-if="showOptions">
        <router-link :to="`/dashboard/subscription/${subscription._id}/edit`" tag="li">
          <i class="fa fa-pencil"></i> Edit
        </router-link>
        <li @click="handleRemoveSubscription($event, subscription._id)">
          <i class="fa fa-trash"></i> Remove
        </li>
        <li @click="handleDuplicateSubscription($event, subscription)">
          <i class="fa fa-copy"></i> Duplicate
        </li>
      </ul>
    </div>
  </router-link>
</template>

<script>
import moment from "moment";
import { EventBus } from "../../EventBus";
import { v4 as uuidv4 } from "uuid";
import { clickAway } from "../../mixins/clickAway";
import { subscriptionActions } from "../../mixins/subscriptionActions";

export default {
  mixins: [clickAway, subscriptionActions],
  props: {
    subscription: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showOptions: false,
    };
  },
  methods: {
    handleOptionsMenu(e) {
      e.preventDefault();

      this.showOptions = !this.showOptions;
    },
  },
  computed: {
    firstPaymentDateString() {
      return moment
        .utc(this.subscription.firstPaymentDate)
        .format("MMMM DD, YYYY");
    },
    upcomingPaymentString() {
      return `
        ${moment
          .utc(this.subscription.upcomingPayments[0].isoString)
          .calendar(null, {
            sameDay: "[Today]",
            nextDay: "[Tomorrow]",
            nextWeek: "dddd (MMMM DD, YYYY)",
            lastDay: "[Yesterday] (MMMM DD, YYYY)",
            lastWeek: "[Last] dddd (MMMM DD, YYYY)",
            sameElse: "MMMM DD, YYYY",
          })}
      `;
    },
    billingPeriod() {
      if (this.subscription.interval > 1) {
        return `Every ${this.subscription.interval} ${this.subscription.duration}s`;
      }
      switch (this.subscription.duration) {
        case "day": {
          return "Daily";
          break;
        }
        case "year": {
          return "Yearly";
          break;
        }
        case "month": {
          return "Monthly";
          break;
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
  margin-bottom: 16px;
  height: $height;
  line-height: $height;
  border-radius: var(--borderRadius);
  white-space: nowrap;
  box-shadow: 0px 4px 4px rgba(43, 46, 51, 0.05);
  cursor: pointer;

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
    overflow: hidden;

    .tag {
      background-color: #e9f7ec;
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

@media screen and (min-width: 768px) {
  .subscriptionListItem {
    background-color: var(--containerBackground) !important;
  }
}

@media screen and (max-width: 767px) {
  .subscriptionListItem {
    flex-flow: row wrap;
    height: auto;
    padding: 1em;
    color: #fff;

    .flexChild {
      display: none;
      flex-basis: auto;
      line-height: 100%;
      padding: 0 !important;
    }

    .name {
      display: block;
      flex-grow: 1;
    }

    .price {
      display: block;
    }

    .nextPayment {
      display: block;
      flex-basis: 100%;
      font-size: 80%;
      font-weight: bold;
      opacity: 0.5;
      line-height: 1.5;
    }

    .options {
      ul.optionsMenu {
        left: 0;
        right: unset;
      }
    }
  }
}
</style>
