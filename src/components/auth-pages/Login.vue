<template>
  <div class="auth-wrapper">
    <div class="auth-left"></div>
    <div class="auth-right">
      <form class="auth-form">
        <h4>Login to your account to view, edit, and track your subscriptions.</h4>
        <text-input
          v-model="email"
          label="Email"
          type="email"
          placeholder="e.g. chrismartin@music.com"
          :errors="formErrors.filter(error => error.field === 'email')"
        ></text-input>
        <text-input
          v-model="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          :errors="formErrors.filter(error => error.field === 'password')"
        ></text-input>
        <submit-button @handle-submit="handleSubmit">Login</submit-button>
        <p class="footerP">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { formErrors } from "../../mixins/formErrors";
import { modal } from "../../mixins/modal";

import TextInput from "../general/inputs/TextInput";
import SubmitButton from "../general/inputs/SubmitButton";

export default {
  mixins: [formErrors, modal],
  components: {
    TextInput,
    SubmitButton
  },
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      formErrors: [],
    };
  },
  methods: {
    handleSubmit() {    
      this.clearErrors();

      const data = {
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch("login", data)
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch((err) => {
          console.error(err);

          if (err.response.status === 403) {
            this.modal(err.response.data.msg, "danger");

            this.password = "";
          } else if (err.response.status === 500) {
            this.modal("Server error, please try again later.", "danger");

            this.password = "";
          } else {
            this.addFormError(err, "email");
          }
        });
    },
    handleShowPassword() {
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
  },
  beforeCreate() {
    if (this.$store.state.isAuthenticated) {
      this.$router.push("/dashboard");
    }
  },
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
    justify-content: center;
    padding: 1rem;
  }

  .auth-form {
    background-color: var(--containerBackground);
    max-width: 460px;
    padding: 4em 2em;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: var(--borderRadius);

    h4 {
      font-size: 2em;
      line-height: 140%;
      margin-bottom: 2em;
    }

    .footerP {
      margin-top: 2em;
      text-align: center;

      a {
        color: inherit;
        text-decoration-color: var(--mainAccent);

        &:hover {
          color: var(--mainAccent);
        }
      }
    }
  }
}

.password {
  position: relative;

  .show-password-button {
    cursor: pointer;
    position: absolute;
    bottom: 12px;
    right: 14px;
  }
}

@media screen and (max-width: 767px) {
  .auth-wrapper {
    flex-direction: column;
  }
}
</style>
