<template>
  <div id="app">
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>|
      <router-link to="/">Home</router-link>
      <span v-if="isLoggedIn">
        |
        <a @click="logout">Logout</a>
      </span>
      <span v-else>
        |
        <router-link to="/login">Login</router-link>|
        <router-link to="/register">Register</router-link>
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
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    logout: function() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/login");
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  beforeCreate: function() {
    // When the app is first created (or the page is refreshed),
    // we need to determine if the user has a token loaded,
    // and attach it to Axios
    const token = localStorage.getItem("token");

    if (token) {
      this.$http.defaults.headers.common["x-auth-token"] = token;

      // Now, verify the token with the backend
      this.$store
        .dispatch("verifyToken")
        .then(() => {})
        .catch(err => {
          console.error(err);
          this.$router.push("/login");
        });
    } else {
      delete this.$http.defaults.headers.common["x-auth-token"];
    }
  },
  created: function() {
    // Intercepting axios calls to determine if we get 401 unauthorized
    // If we do, logout the user
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout);
        }
        throw err;
      });
    });
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
