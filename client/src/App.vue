<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Navigation from "./components/WebApp/Navigation";
import MainMenu from "./components/WebApp/MainMenu";

export default {
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout: function () {
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
  components: {
    navigation: Navigation,
    mainMenu: MainMenu
  },
  beforeCreate: function () {
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
  },
  created: function () {
    // Intercepting axios calls to determine if we get 401 unauthorized
    // If we do, logout the user
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },
};
</script>

<style lang="scss">
:root {
  --containerBackground: #ffffff;
  --bodyBackground: #f4f8f9;
  --mainAccent: #8369fe;
  --mainAccentFaint: #EEEBFF;
  --textLight: #829fae;
  --textDark: #3c4346;
  --danger: #fd6a2b;
  --success: #7bd171;

  --borderRadius: 5px;
}

*, ::after, ::before {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

body {
  background-color: var(--bodyBackground);
  color: var(--textLight);
  font-family:Arial, Helvetica, sans-serif;
}

strong {
  font-weight: bold;
}
</style>