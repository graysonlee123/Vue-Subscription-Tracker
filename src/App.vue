<template>
  <div id="app">
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>|
      <router-link to="/home">Home</router-link>
      <span v-if="isLoggedIn">
        |
        <a @click="logout">Logout</a>
      </span>
    </nav>
    <img src="./assets/logo.png" />
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
