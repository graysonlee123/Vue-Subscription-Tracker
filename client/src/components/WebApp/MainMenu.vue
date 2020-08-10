<template>
  <div id="main-menu">
    I am the main menu.
    <input type="text" value="Logout" class="roundedButton" @click="handleLogout()" />
  </div>
</template>

<script>
export default {
  methods: {
    handleLogout: function () {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>

<style lang="scss">
#main-menu {
  background-color: var(--containerBackground);
}
</style>