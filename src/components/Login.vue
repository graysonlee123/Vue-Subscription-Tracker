<template>
  <div>
    <h4>Login</h4>
    <form @submit.prevent="handleSubmit">
      <label for="email">Email</label>
      <div>
        <input id="email" type="text" v-model="email" autofocus />
      </div>
      <label for="password">Password</label>
      <div>
        <input id="password" type="text" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleSubmit: function() {
      const { email, password } = this;

      this.$store.dispatch("login", { email, password }).then(() => {
        this.$router.push("/dashboard").catch(err => console.error(err));
      });
    }
  }
};
</script>