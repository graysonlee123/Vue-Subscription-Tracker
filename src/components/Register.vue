<template>
  <div class="auth-wrapper">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <h4>Register</h4>
      <div class="inputs-2-col">
        <div class="field-wrapper">
          <label for="first-name">First Name</label>
          <div class="input-wrapper">
            <input id="first-name" type="text" v-model="first_name" autofocus />
          </div>
          <p
            class="field-error"
            v-if="formErrors.find(({field}) => field === 'first_name')"
          >{{formErrors.find(({field}) => field ==='first_name').msg}}</p>
        </div>
        <div class="field-wrapper">
          <label for="last-name">Last Name</label>
          <div class="input-wrapper">
            <input id="last-name" type="text" v-model="last_name" autofocus />
          </div>
          <p
            class="field-error"
            v-if="formErrors.find(({field}) => field === 'last_name')"
          >{{formErrors.find(({field}) => field ==='last_name').msg}}</p>
        </div>
      </div>
      <div class="field-wrapper">
        <label for="email">Email</label>
        <div class="input-wrapper">
          <input id="email" type="text" v-model="email" autofocus />
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({field}) => field === 'email')"
        >{{formErrors.find(({field}) => field ==='email').msg}}</p>
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
          v-if="formErrors.find(({field}) => field === 'password')"
        >{{formErrors.find(({field}) => field ==='password').msg}}</p>
      </div>
      <div class="field-wrapper">
        <label for="password-confirm">Verify Password</label>
        <div class="input-wrapper">
          <input id="password-confirm" type="password" v-model="password_confirmation" />
        </div>
        <p
          class="field-error"
          v-if="formErrors.find(({field}) => field === 'password-confirm')"
        >{{formErrors.find(({field}) => field ==='password-confirm').msg}}</p>
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
      first_name: "",
      last_name: "",
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
      if (this.password !== this.password_confirmation) {
        this.addFormError('password', 'Passwords must match')

        this.password = "";
        this.password_confirmation = "";
      } else {
        const data = {
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          password: this.password
        };

        this.$store
          .dispatch("register", data)
          .then(() => {
            this.$router.push("/app/dashboard");
          })
          .catch(err => {
            console.error(err);
            const errors = err.response.data.errors;

            if (errors)
              errors.forEach(({ param, msg }) => this.addFormError(param, msg));
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

<style lang="scss">

</style>