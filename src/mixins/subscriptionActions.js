import { EventBus } from "../EventBus";
import { modal } from "./modal";

export const subscriptionActions = {
  mixins: [modal],
  methods: {
    // @param e
    // The click event, passed with $event

    // @param id
    // The id of the subscription being removed
    async handleRemoveSubscription(e, id) {
      e.preventDefault();

      if (!id) {
        this.modal(
          "There was an error removing that subscription. Please try again later.",
          "danger"
        );
      }

      try {
        const req = await this.$http.delete(`/api/subscription/${id}`);

        EventBus.$emit("refreshSubscriptions");

        this.$router.push("/dashboard");
        this.modal("Subscription was removed.", "success");
      } catch (err) {
        this.modal(
          "There was an error removing that subscription. Please try again later.",
          "danger"
        );
        console.log(err);
      }
    },
    async handleDuplicateSubscription(e, subscription) {
      e.preventDefault();

      if (!subscription) {
        this.modal(
          "There was an error removing that subscription. Please try again later.",
          "danger"
        );
      }

      try {
        const subscriptionReq = {
          price: subscription.price,
          name: subscription.name,
          description: subscription.description,
          firstPaymentDate: subscription.firstPaymentDate,
          interval: subscription.interval,
          duration: subscription.duration,
          color: subscription.color,
          paymentMethod: subscription.paymentMethod,
          note: subscription.note
        };

        const req = await this.$http.post(
          "/api/subscription/",
          subscriptionReq
        );

        EventBus.$emit("refreshSubscriptions");

        this.$router.push(
          `/dashboard/subscription/${req.data.subscription._id}/edit`
        );

        this.modal(
          "You are now editing the duplicated subscription.",
          "success",
          5000
        );
      } catch (err) {
        this.modal(
          "There was an error duplicating that subscription. Please try again later.",
          "danger"
        );
        console.log(err);
      }
    }
  }
};
