import { v4 as uuidv4 } from "uuid";

export const modal = {
  methods: {
    // @param message
    // Message to send the user

    // @param type
    // [Danger, success, neutral] to color the modal

    // @param duration
    // Duration in milliseconds to show the modal
    modal(message, type, duration) {
      const payload = {
        type,
        message,
        uuid: uuidv4()
      };

      if (duration) payload.duration = duration;
      this.$store.dispatch("addModal", payload);
    }
  }
};
