<template>
  <div>
    <settings-header>Advanced</settings-header>
    <input
      type="button"
      value="Delete Account"
      class="roundedButton danger"
      @click="deleteAccount()"
    />
  </div>
</template>

<script>
import SettingsHeader from "./SettingsHeader";

export default {
  data() {
    return {};
  },
  components: {
    settingsHeader: SettingsHeader,
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

</style>
