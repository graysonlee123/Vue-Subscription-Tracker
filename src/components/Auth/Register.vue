<template>
  <div class="auth-wrapper">
    <div class="auth-left"></div>
    <div class="auth-right">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <h4>Register to get in control of your subscriptions.</h4>
        <div class="doubleInputGroup">
          <div
            class="inputGroup"
            :class="{hasError: formErrors.find(({field}) => field === 'first_name')}"
          >
            <label for="first_name" class="inputGroup__label">
              First Name
              <span
                class="fieldError"
                v-if="formErrors.find(({field}) => field === 'first_name')"
              >{{formErrors.find(({field}) => field ==='first_name').msg}}</span>
            </label>
            <div class="input-wrapper">
              <input
                id="first_name"
                type="text"
                placeholder="Johnny"
                v-model="first_name"
                v-on:blur="removeFormError('first_name')"
                autofocus
              />
            </div>
          </div>
          <div
            class="inputGroup"
            :class="{hasError: formErrors.find(({field}) => field === 'last_name')}"
          >
            <label for="last_name" class="inputGroup__label">
              Last Name
              <span
                class="fieldError"
                v-if="formErrors.find(({field}) => field === 'last_name')"
              >{{formErrors.find(({field}) => field ==='last_name').msg}}</span>
            </label>
            <div class="input-wrapper">
              <input
                id="last_name"
                type="text"
                placeholder="Appleseed"
                v-model="last_name"
                v-on:blur="removeFormError('last_name')"
              />
            </div>
          </div>
        </div>
        <div
          class="inputGroup"
          :class="{hasError: formErrors.find(({field}) => field === 'email')}"
        >
          <label for="email" class="inputGroup__label">
            Email
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'email')"
            >{{formErrors.find(({field}) => field ==='email').msg}}</span>
          </label>
          <div class="input-wrapper">
            <input
              id="email"
              type="text"
              placeholder="johnnyappleseed@gmail.com"
              v-model="email"
              v-on:blur="removeFormError('email')"
            />
          </div>
        </div>
        <div
          class="inputGroup"
          :class="{hasError: formErrors.find(({field}) => field === 'password')}"
        >
          <label for="password" class="inputGroup__label">
            Password
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'password')"
            >{{formErrors.find(({field}) => field ==='password').msg}}</span>
          </label>
          <div class="input-wrapper password">
            <input
              id="password"
              type="password"
              placeholder="Must be at least 8 characters"
              v-model="password"
              v-on:blur="removeFormError('password')"
            />
            <span class="show-password-button" @click="handleShowPassword">
              <i id="password-icon" class="fas fa-eye"></i>
            </span>
          </div>
        </div>
        <div class="submit__wrapper">
          <input type="submit" class="roundedButton" value="Register" />
        </div>
        <p class="footerP">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import LanguageSelect from '../Global/LanguageSelect.vue';
import { v4 as uuidv4 } from 'uuid';

import { formErrors } from '../../mixins/formErrors';

export default {
  data() {
    return {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      showPassword: false,
      formErrors: [],
    };
  },
  mixins: [formErrors],
  components: {
    languageSelect: LanguageSelect,
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
        .dispatch('register', data)
        .then(() => {
          this.$router.push('/dashboard');
        })
        .catch((err) => {
          console.error(err);

          if (err.response.status === 500) {
            this.$store.dispatch('addModal', {
              type: 'danger',
              message: 'Server error, please try again later.',
              uuid: uuidv4(),
            });

            this.password = '';
          } else {
            this.addFormError(err, 'first_name');
          }
        });
    },
    handleShowPassword() {
      const passEl = document.getElementById('password');
      const eyeEl = document.getElementById('password-icon');

      if (this.showPassword) {
        passEl.type = 'password';
        this.showPassword = false;

        eyeEl.classList.remove('fa-eye-slash');
        eyeEl.classList.add('fa-eye');
      } else {
        passEl.type = 'text';
        this.showPassword = true;

        eyeEl.classList.remove('fa-eye');
        eyeEl.classList.add('fa-eye-slash');
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

    .inputGroup {
      margin-bottom: 1.5em;
    }

    .submit__wrapper {
      text-align: center;
      margin-bottom: 2em;
    }

    .footerP {
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

.doubleInputGroup {
  display: flex;
  justify-content: space-between;

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
