<template>
  <div id="app">
    <modal />
    <transition name="page-transition" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Modal from "./components/Modal";

export default {
  components: {
    Modal,
  },
  methods: {
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
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  beforeCreate() {
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
        .catch((err) => {
          console.error(err);
          this.$router.push("/login");
        });
    } else {
      delete this.$http.defaults.headers.common["x-auth-token"];
    }

    // Also, we want to clear any previous alerts
    // this.$store.commit("clear_modals");
  },
  created() {
    // Intercepting axios calls to determine if we get 401 unauthorized
    // If we do, logout the user
    this.$http.interceptors.response.use(
      undefined,
      (err) =>
        new Promise(function () {
          if (
            err.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            this.$store.dispatch("logout");
          }
          throw err;
        })
    );
  },
};
</script>

<style lang="scss">
:root {
  --containerBackground: #ffffff;
  --bodyBackground: #f4f8f9;
  --mainAccent: #8369fe;
  --mainAccentFaint: #eeebff;
  --textLight: #829fae;
  --textDark: #3c4346;
  --danger: #fd6a2b;
  --dangerFaint: #ecdad5;
  --success: #7bd171;
  --successFaint: #e4ffd1;

  --borderRadius: 5px;
}

@import "./assets/css/reset.css";
@import "./assets/css/app.css";

// Vue Transitions

.page-transition-enter-active,
.page-transition-leave-active {
  transition: top 400ms ease-in-out, opacity 200ms ease;
  position: fixed;
  left: 0;
  right: 0;
}

.page-transition-enter-to,
.page-transition-leave {
  top: 0;
  opacity: 1;
}

.page-transition-enter,
.page-transition-leave-to {
  top: 20px;
  opacity: 0;
}
</style>
