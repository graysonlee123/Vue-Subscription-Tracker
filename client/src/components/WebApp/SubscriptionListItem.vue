<template>
  <li class="subscriptionListItem">
    <div class="flexChild color">
      <span class="color__swatch" :style="{borderColor: subscription.color}"></span>
    </div>
    <div class="flexChild textContainer name">{{subscription.name}}</div>
    <div class="flexChild textContainer price">${{subscription.price}}</div>
    <div class="flexChild textContainer paidToDate">${{subscription.paidToDate}}</div>
    <div
      class="flexChild textContainer billingPeriod"
    >{{billingPeriod}}</div>
    <div
      class="flexChild textContainer paymentMethod"
    >{{subscription.paymentMethod || 'None provided'}}</div>
    <div class="flexChild tags">
      <span class="tag">productibity</span>
      <span class="tag">media</span>
      <span class="tag">essential</span>
    </div>
    <div class="flexChild textContainer firstPayment">{{subscription.firstPaymentDate | moment("MMMM DD, YYYY")}}</div>
    <div class="flexChild textContainer nextPayment">{{subscription.upcomingPayments[0].fromNow}} ({{subscription.upcomingPayments[0].dateString | moment("MMMM DD, YYYY")}})</div>
    <div class="flexChild options">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </li>
</template>

<script>
import moment from "moment";

export default {
  props: {
    subscription: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getUpcomingPayments: function () {
      // Should remain an arrow function to remain this binding
      const pushDateToUpcoming = (date) => {
        this.subscription.upcomingPayments.push({
          dateString: date.format("MM/DD/YY"),
          fromNow: date.fromNow(),
        });
      };

      // Set initial values in subscription data
      this.subscription.upcomingPayments = [];
      this.subscription.paidToDate = 0;

      // Logic Begins
      const date = moment(this.subscription.firstPaymentDate);

      // "fast forward" until we find the next payment date
      while (moment().isAfter(date)) {
        date.add(this.subscription.interval, this.subscription.duration + "s");
        this.subscription.paidToDate =
          this.subscription.paidToDate + parseFloat(this.subscription.price);
      }

      this.subscription.paidToDate = this.subscription.paidToDate.toFixed(2);

      pushDateToUpcoming(date);

      for (let i = 0; i < 7; i++) {
        date.add(this.subscription.interval, this.subscription.duration + "s");
        pushDateToUpcoming(date);
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
  created: function () {
    this.getUpcomingPayments();
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
      background-color: var(--bodyBackground);
      padding: 12px 16px;
      font-size: 70%;
      cursor: pointer;
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
    text-align: center;
  }
}
</style>