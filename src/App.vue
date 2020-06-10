<template>
  <div id="app">
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

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Muli:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;700&display=swap");

$body-family: Muli, sans-serif;
$header-family: Poppins, sans-serif;

* {
  box-sizing: border-box;
}

body {
  font-family: $body-family;
  font-size: 16px;
  overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: $header-family;
}

#app {
  height: 100vh;
  min-height: 100vh;
}

form {
  h4 {
    font-size: 1.6rem;
    font-weight: 300;
    margin-bottom: 3rem;
    line-height: 1.6;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.2rem;
  }

  input[type="text"],
  input[type="password"] {
    padding: 12px;
    width: 100%;
    border-color: transparentize($color: #000000, $amount: 0.8);
  }

  input[type="submit"], button {
    background-color: #333;
    color: #fff;
    border: none;
    font-size: 1.2rem;
    padding: 8px 32px;
    cursor: pointer;
  }

  .field-wrapper {
    margin-bottom: 1.5rem;
    clear: both;

    .input-wrapper.password {
      position: relative;

      .show-password-button {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        padding: 12px;
        cursor: pointer;
      }
    }
  }

  .field-error {
    margin-top: 0.5rem;
    padding: 12px 16px;
    background-color: transparentize($color: red, $amount: 0.9);
    font-size: 0.8rem;
    color: red;
  }
}
</style>