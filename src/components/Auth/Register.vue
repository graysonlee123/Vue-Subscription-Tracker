<template>
  <div class="auth-wrapper">
    <div class="auth-left"></div>
    <div class="auth-right">
      <div class="top">
        <div class="top-left">
          <language-select />
        </div>
        <div class="top-right">
          Already have an account?
          <router-link to="/login">Sign In</router-link>
        </div>
      </div>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <h4>Register to get in control of your subscriptions</h4>
        <div class="inputs-2-col">
          <div class="field-wrapper">
            <label for="first_name">First Name</label>
            <div class="input-wrapper">
              <input
                id="first_name"
                type="text"
                placeholder="Johnny"
                v-model="first_name"
                v-on:focusout="handleLostFocus"
                autofocus
              />
            </div>
            <p
              class="field-error"
              v-if="formErrors.find(({field}) => field === 'first_name')"
            >{{formErrors.find(({field}) => field ==='first_name').msg}}</p>
          </div>
          <div class="field-wrapper">
            <label for="last_name">Last Name</label>
            <div class="input-wrapper">
              <input
                id="last_name"
                type="text"
                placeholder="Appleseed"
                v-model="last_name"
                v-on:focusout="handleLostFocus"
              />
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
            <input
              id="email"
              type="text"
              placeholder="johnnyappleseed@gmail.com"
              v-model="email"
              v-on:focusout="handleLostFocus"
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
              placeholder="Must be at least 8 characters"
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
        <div class="input-wrapper">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LanguageSelect from "../Global/LanguageSelect.vue";

export default {
  data: function() {
    return {
      email: "",
      first_name: "",
      last_name: "",
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

          if (errors) {
            errors.forEach(({ param, msg }) => this.addFormError(param, msg));
            document.getElementById("first_name").focus();
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
    addFormError: function(field, msg) {
      this.formErrors.push({
        field,
        msg
      });
    },
    handleLostFocus: function(e) {
      const elementId = e.target.id;
      if (this.formErrors.length) {
        this.removeFormError(elementId);
      }
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

    .top {
      position: absolute;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .auth-form {
    max-width: 460px;

    .inputs-2-col .field-wrapper {
      float: left;
      clear: unset;
      width: 48%;

      &:nth-child(1) {
        margin-right: 2%;
      }
      &:nth-child(2) {
        margin-left: 2%;
      }
    }
  }
}
</style>