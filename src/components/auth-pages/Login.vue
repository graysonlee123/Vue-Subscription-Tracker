<template>
  <div class="auth-wrapper">
    <form class="auth-form">
      <h1>Login to your account to view, edit, and track your subscriptions.</h1>
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
    SubmitButton,
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
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;

  .auth-form {
    font-size: 1.1rem;
    background-color: var(--containerBackground);
    padding: 3em 1.6em;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: var(--borderRadius);

    h1 {
      color: var(--textLight);
      margin-bottom: 1.6em;
    }

    .footerP {
      margin-top: 4em;
      text-align: center;
      font-size: 0.9rem;

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
</style>
