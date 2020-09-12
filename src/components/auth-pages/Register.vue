<template>
  <div class="auth-wrapper">
    <form class="auth-form">
      <h1>Register to get in control of your subscriptions.</h1>
      <div class="col2">
        <text-input
          v-model="first_name"
          label="First name"
          type="text"
          placeholder="Chris"
          :errors="formErrors.filter(error => error.field === 'first_name')"
        ></text-input>
        <text-input
          v-model="last_name"
          label="Last name"
          type="text"
          placeholder="Martin"
          :errors="formErrors.filter(error => error.field === 'last_name')"
        ></text-input>
      </div>
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
      <submit-button @handle-submit="handleSubmit"></submit-button>
      <p class="footerP">
        Already have an account?
        <router-link to="/login">Login</router-link>
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
      first_name: "",
      last_name: "",
      password: "",
      showPassword: false,
      formErrors: [],
    };
  },
  methods: {
    handleSubmit() {
      this.formErrors = [];

      const data = {
        email: this.email,
        first_name: this.first_name,
        last_name: this.last_name,
        password: this.password,
      };

      this.$store
        .dispatch("register", data)
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch((err) => {
          console.error(err);

          if (err.response.status === 500) {
            this.modal("Server error, please try again later.", "danger");

            this.password = "";
          } else {
            this.addFormError(err, "first_name");
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
    handleLostFocus(e) {
      const elementId = e.target.id;
      if (this.formErrors.length) {
        this.removeFormError(elementId);
      }
    },
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

.col2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .inputGroup {
    flex: 0 0 48%;
  }
}

@media screen and (max-width: 767px) {
  .auth-wrapper {
    flex-direction: column;
  }
}
</style>
