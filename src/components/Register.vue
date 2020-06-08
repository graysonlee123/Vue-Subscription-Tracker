<template>
  <div class="auth-wrapper">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h4>Register</h4>
      <div class="field-wrapper">
        <label for="email">Email</label>
        <div class="input-wrapper">
          <input id="email" type="text" v-model="email" autofocus />
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({param}) => param === 'email')"
        >{{formErrors.find(({param}) => param ==='email').msg}}</p>
      </div>
      <div class="field-wrapper">
        <label for="password">Password</label>
        <div class="input-wrapper password">
          <input id="password" type="password" v-model="password" />
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
        <label for="password-confirm">Verify Password</label>
        <div class="input-wrapper">
          <input id="password-confirm" type="password" v-model="password_confirmation" />
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({param}) => param === 'password-confirm')"
        >{{formErrors.find(({param}) => param ==='password-confirm').msg}}</p>
      </div>
      <div class="input-wrapper">
        <button type="submit">Register</button>
      </div>
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
      password_confirmation: "",
      showPassword: false,
      formErrors: []
    };
  },
  methods: {
    handleSubmit: function() {
      this.formErrors = [];

      // Preform some front-end validation
      // TODO: Make better front-end validation

      if (this.password.length <= 6) {
        this.formErrors.push({
          param: "password",
          msg: "Password must be at least six characters long!"
        });
      } else if (this.password !== this.password_confirmation) {
        this.formErrors.push({
          param: "password-confirm",
          msg: "Passwords must match!"
        });

        this.password = "";
        this.password_confirmation = "";
      } else if (this.email.length < 1) {
        this.formErrors.push({
          param: "email",
          msg: "You must provide an email!"
        });
      } else {
        let data = {
          email: this.email,
          password: this.password
        };

        this.$store
          .dispatch("register", data)
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