<template>
  <div class="auth-wrapper">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h4>Login</h4>
      <div>
        <input id="email" type="text" placeholder="Email Address" v-model="email" autofocus />
      </div>
      <div class="password-input">
        <input id="password" type="password" placeholder="Password" v-model="password" />
        <span class="show-password-button" @click="handleShowPassword">
          <i id="password-icon" class="fas fa-eye"></i>
        </span>
      </div>
      <button type="submit">Login</button>
      <p>
        Don't have an account yet?
        <router-link to="/register">Sign Up</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: "",
      password: "",
      showPassword: false
    };
  },
  methods: {
    handleSubmit: function() {
      const { email, password } = this;

      this.$store.dispatch("login", { email, password }).then(() => {
        this.$router.push("/dashboard").catch(err => console.error(err));
      });
    },
    handleShowPassword: function() {
      const passEl = document.getElementById("password");
      const eyeEl = document.getElementById("password-icon");

      if (this.showPassword) {
        passEl.type = "password";
        this.showPassword = false;

        eyeEl.classList.remove("fa-eye-slash");
        eyeEl.classList.add("fa-eye");
      } else {
        passEl.type = "text";
        this.showPassword = true;

        eyeEl.classList.remove("fa-eye");
        eyeEl.classList.add("fa-eye-slash");
      }
    }
  }
};
</script>