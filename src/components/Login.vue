<template>
  <div>
    <h4>Login</h4>
    <form>
      <label for="email">Email</label>
      <div>
        <input id="email" type="text" v-model="email" autofocus />
      </div>
      <label for="password">Password</label>
      <div>
        <input id="password" type="text" v-model="password" />
      </div>
      <button type="submit" @click="handleSubmit">Login</button>
    </form>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      if (this.password.length > 0) {
        this.$http
          .post("http://localhost:3000/api/auth/login", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("jwt", res.data.token);

            if (localStorage.getItem("jwt") != null) {
              this.$emit("loggedIn");

              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                this.$router.push("dashboard");
              }
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>