<template>
  <div class="auth-wrapper">
    <div class="auth-left"></div>
    <div class="auth-right">
      <div class="top-left">
        <language-select/>
      </div>
      <div class="top-right">
        Need to sign up? It's free!
        <router-link to="/register">Register</router-link>
      </div>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <h4>Login to your account to view, edit, and track your subscriptions</h4>
        <div class="field-wrapper">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input
              id="email"
              type="text"
              placeholder="johnnyappleseed@gmail.com"
              v-model="email"
              v-on:focusout="handleLostFocus"
              autofocus
            />
          </div>
          <p
            class="field-error"
            v-if="formErrors.find(({field}) => field === 'email')"
          >{{formErrors.find(({field}) => field ==='email').msg}}</p>
        </div>
        <div class="field-wrapper">
          <label for="password">Password</label>
          <div class="input-wrapper password">
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              v-model="password"
              v-on:focusout="handleLostFocus"
            />
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
      </form>
    </div>
  </div>
</template>

<script>
import LanguageSelect from '../Global/LanguageSelect';

export default {
  data: function() {
    return {
      email: "",
      password: "",
      showPassword: false,
      formErrors: []
    };
  },
  components: {
    languageSelect: LanguageSelect
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

          if (errors) {
            errors.forEach(({ param, msg }) => this.addFormError(param, msg));
            document.getElementById("email").focus();
          }
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
    handleLostFocus: function(e) {
      const elementId = e.target.id;
      if (this.formErrors.length) {
        this.removeFormError(elementId);
      }
    },
    addFormError: function(field, msg) {
      this.formErrors.push({
        field,
        msg
      });
    },
    removeFormError: function(field) {
      this.formErrors.find((error, index) => {
        if (error && error.field === field) {
          this.formErrors.splice(index, 1);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-wrapper {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;

  .auth-left {
    flex-basis: 40%;
    background: {
      image: url("https://source.unsplash.com/random");
      size: cover;
      repeat: no-repeat;
      position: center;
    }
  }

  .auth-right {
    flex-basis: 60%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem;

    .top-left,
    .top-right {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }

    .top-right {
      left: unset;
      right: 1rem;
    }
  }

  .auth-form {
    max-width: 460px;
  }
}
</style>