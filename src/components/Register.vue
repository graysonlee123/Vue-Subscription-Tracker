<template>
  <div class="auth-wrapper">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h4>Register</h4>
      <div>
        <label for="email">Email</label>
        <input id="email" type="text" v-model="email" autofocus />
      </div>
      <div class="password-input">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" />
        <span class="show-password-button" @click="handleShowPassword">
          <i id="password-icon" class="fas fa-eye"></i>
        </span>
      </div>
      <div>
        <label for="password-confirm">Verify Password</label>
        <input id="password-confirm" type="password" v-model="password_confirmation" />
      </div>
      <button type="submit">Register</button>
      <p>
        Already have an account?
        <router-link to="/login">Log In</router-link>
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
    },
    handleShowPassword: function() {
      const passEl = document.getElementById("password");
      const passEl2 = document.getElementById("password-confirm");
      const eyeEl = document.getElementById("password-icon");

      if (this.showPassword) {
        passEl.type = "password";
        passEl2.type = "password";
        this.showPassword = false;

        eyeEl.classList.remove("fa-eye-slash");
        eyeEl.classList.add("fa-eye");
      } else {
        passEl.type = "text";
        passEl2.type = "text";
        this.showPassword = true;

        eyeEl.classList.remove("fa-eye");
        eyeEl.classList.add("fa-eye-slash");
      }
    }
  }
};
</script>