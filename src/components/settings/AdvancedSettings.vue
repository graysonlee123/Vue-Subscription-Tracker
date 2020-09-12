<template>
  <div>
    <settings-header>Advanced</settings-header>
    <div class="buttonWrapper">
      <submit-button align="left" color="danger" @handle-submit="deleteAccount">Delete Account</submit-button>
    </div>
  </div>
</template>

<script>
import SettingsHeader from "./SettingsHeader";
import SubmitButton from "../general/inputs/SubmitButton";

export default {
  data() {
    return {};
  },
  components: {
    settingsHeader: SettingsHeader,
    SubmitButton,
  },
  methods: {
    async deleteAccount() {
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone. All data associated with the account will be erased."
        )
      ) {
        const data = await this.$http.delete("/api/user");

        console.log(data);
        this.logout();
      }
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/login");
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonWrapper {
  padding: 0 1.6rem;
}
</style>
