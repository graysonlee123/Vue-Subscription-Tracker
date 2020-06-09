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
          v-if="formErrors.find(({field}) => field === 'email')"
        >{{formErrors.find(({field}) => field ==='email').msg}}</p>
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
          v-if="formErrors.find(({field}) => field === 'password')"
        >{{formErrors.find(({field}) => field ==='password').msg}}</p>
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

      const data = {
        email: this.email,
        password: this.password
      };

      this.$store
        .dispatch("login", data)
        .then(() => {
          this.$router.push("/app/dashboard");
        })
        .catch(err => {
          console.error(err);
          const errors = err.response.data.errors;

          if (errors)
            errors.forEach(({ param, msg }) => this.addFormError(param, msg));
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
    },
    addFormError: function(field, msg) {
      this.formErrors.push({
        field,
        msg
      });
    }
  }
};
</script>