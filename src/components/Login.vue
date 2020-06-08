<template>
  <div class="auth-wrapper">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h4>Login</h4>
      <div class="field-wrapper">
        <div class="input-wrapper">
          <input id="email" type="text" placeholder="Email Address" v-model="email" autofocus />
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({param}) => param === 'email')"
        >{{formErrors.find(({param}) => param ==='email').msg}}</p>
      </div>
      <div class="field-wrapper">
        <div class="input-wrapper password">
          <input id="password" type="password" placeholder="Password" v-model="password" />
          <span class="show-password-button" @click="handleShowPassword">
            <i id="password-icon" class="fas fa-eye"></i>
          </span>
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({param}) => param === 'password')"
        >{{formErrors.find(({param}) => param ==='password').msg}}</p>
      </div>
      <div class="field-wrapper">
        <button type="submit">Login</button>
      </div>
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
      showPassword: false,
      formErrors: []
    };
  },
  methods: {
    handleSubmit: function() {
      this.formErrors = [];

      const { email, password } = this;

      if (this.email.length < 1) {
        this.formErrors.push({
          param: "email",
          msg: "You must provide an email!"
        });
      } else if (this.password.length < 1) {
        this.formErrors.push({
          param: "password",
          msg: "You must provide a password!"
        });
      } else {
        this.$store
          .dispatch("login", { email, password })
          .then(() => {
            this.$router.push("/dashboard");
          })
          .catch(err => {
            console.error(err);
            const errors = err.response.data.errors;

            if (errors)
              err.response.data.errors.forEach(({ msg, param }) => {
                this.formErrors.push({
                  param,
                  msg
                });
              });
          });
      }
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