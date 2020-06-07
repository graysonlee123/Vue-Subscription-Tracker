<template>
  <div>
    <h4>Register</h4>
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
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: "",
      password: "",
      password_confirmation: ""
    };
  },
  methods: {
    handleSubmit: function() {
      if (this.password !== this.password_confirmation) {
        this.password = "";
        this.password_confirmation = "";

        return alert("Passwords do not match!");
      } else {
        let data = {
          email: this.email,
          password: this.password
        };

        this.$store.dispatch("register", data).then(() => {
          this.$router.push("/dashboard").catch(err => console.error(err));
        });
      }
    }
  }
};
</script>