<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label for="email">Email</label>
      <div>
        <input id="email" type="text" v-model="email" autofocus />
      </div>
      <label for="password">Password</label>
      <div>
        <input id="password" type="text" v-model="password" />
      </div>
      <label for="password-confirm">Verify Password</label>
      <div>
        <input id="password-confirm" type="text" v-model="password_confirmation" />
      </div>

      <div>
        <button type="submit" @click="handleSubmit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["nextUrl"],
  data: function() {
    return {
      email: "",
      password: "",
      password_confirmation: ""
    };
  },
  methods: {
    handleSubmit: function() {
      let data = {
        email: this.email,
        password: this.password
      };

      this.$store.dispatch("register", data).then(() => {
        this.$router.push("/dashboard").catch(err => console.error(err));
      });
      // if (
      //   this.password === this.password_confirmation &&
      //   this.password.length > 0
      // ) {
      //   let url = "http://localhost:3000/api/user";

      //   this.$http
      //     .post(url, {
      //       email: this.email,
      //       password: this.password
      //     })
      //     .then(res => {
      //       localStorage.setItem("user", JSON.stringify(res.data.user));
      //       localStorage.setItem("jwt", res.data.token);

      //       if (localStorage.getItem("jwt") != null) {
      //         this.$emit("loggedIn");

      //         if (this.$route.params.nextUrl != null) {
      //           this.$router.push(this.$route.params.nextUrl);
      //         } else {
      //           this.$router.push("/dashboard");
      //         }
      //       }
      //     })
      //     .catch(err => {
      //       console.error(err);
      //     });
      // } else {
      //   this.password = "";
      //   this.password_confirmation = "";

      //   return alert("Passwords do not match!");
      // }
    }
  }
};
</script>