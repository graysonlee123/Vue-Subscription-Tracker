<template>
  <div id="app">
    <transition name="modal" mode="out-in">
      <div id="modal" v-if="modal" :class="{[modal.type]: true}">
        <p>{{modal.message}}</p>
        <div class="modal__close" @click="handleCloseModal(modal.uuid)">
          <i class="fa fa-times"></i>
        </div>
      </div>
    </transition>
    <router-view />
  </div>
</template>

<script>
import Navigation from './components/WebApp/Navigation';
import MainMenu from './components/WebApp/MainMenu';

export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    modal() {
      return this.$store.getters.alert;
    },
  },
  methods: {
    logout() {
      this.$store
        .dispatch('logout')
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleCloseModal(uuid) {
      this.$store.commit('remove_modal', uuid);
    },
  },
  components: {
    navigation: Navigation,
    mainMenu: MainMenu,
  },
  beforeCreate() {
    // When the app is first created (or the page is refreshed),
    // we need to determine if the user has a token loaded,
    // and attach it to Axios
    const token = localStorage.getItem('token');

    if (token) {
      this.$http.defaults.headers.common['x-auth-token'] = token;

      // Now, verify the token with the backend
      this.$store
        .dispatch('verifyToken')
        .then(() => {})
        .catch((err) => {
          console.error(err);
          this.$router.push('/login');
        });
    } else {
      delete this.$http.defaults.headers.common['x-auth-token'];
    }

    // Also, we want to clear any previous alerts
    // this.$store.commit("clear_modals");
  },
  created() {
    // Intercepting axios calls to determine if we get 401 unauthorized
    // If we do, logout the user
    this.$http.interceptors.response.use(undefined, err => new Promise(function () {
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch('logout');
      }
      throw err;
    }));
  },
};
</script>

<style lang="scss">
:root {
  --containerBackground: #ffffff;
  --bodyBackground: #f4f8f9;
  --mainAccent: #8369fe;
  --mainAccentFaint: #eeebff;
  --textLight: #829fae;
  --textDark: #3c4346;
  --danger: #fd6a2b;
  --dangerFaint: #ecdad5;
  --success: #7bd171;
  --successFaint: #e4ffd1;

  --borderRadius: 5px;
}

@import './assets/reset.css';

*,
::after,
::before {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

body {
  background-color: var(--bodyBackground);
  color: var(--textLight);
  font-family: Arial, Helvetica, sans-serif;
}

h1 {
  font-size: 2em;
  color: var(--mainAccent);
}

strong {
  font-weight: bold;
}

#modal {
  position: fixed;
  top: 50px;
  left: 50%;
  margin-left: -200px + 40px;  // Should be half self width and half navbar width
  width: 400px;
  background-color: #eee;
  color: var(--textDark);
  border-radius: var(--borderRadius);
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  z-index: 10;

  &.success {
    background-color: var(--success);
    color: var(--successFaint);
  }

  &.danger {
    background-color: var(--danger);
    color: var(--dangerFaint);
  }

  &.neutral {
    background-color: grey;
    color: var(--textdark);
  }

  p {
    padding: 1em;
    flex-grow: 1;
  }

  div.modal__close {
    padding: 1em;
    border-left: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
  }
}

// Default input styling
input[type="text"],
input[type="number"],
input[type="password"],
select {
  $height: 42px;

  width: 100%;
  border: 2px solid var(--textLight);
  font-size: 0.8em;
  background-color: transparent;
  color: var(--textDark);
  border-radius: 21px;
  height: $height;
  line-height: $height;
  padding: 0 1.4em;

  &:focus {
    outline: none;
  }
}

input[type="button"].roundedButton,
input[type="submit"].roundedButton {
  background-color: var(--success);
  border-radius: 32px;
  text-align: center;
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  padding: 12px 28px;
  color: #eef6ed;
  cursor: pointer;
  border: none;

  &:focus {
    outline: none;
  }

  &.danger {
    background-color: var(--danger);
  }
}

input[type="number"] {
  // Chrome, safari, edge, opera
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
}

.inputGroup {
  .inputGroup__label {
    display: block;
    margin-bottom: 0.8em;
    color: var(--textLight);
    font-size: 0.8em;
    font-weight: bold;
    padding-left: 1.6em;

    .fieldError {
      color: var(--danger);
    }
  }

  &.hasError {
    input,
    .date-wrapper .date-text,
    .colorPicker__wrapper .colorPicker {
      border-color: var(--danger);
    }
  }
}

// Vue Transitions

.modal-enter-active,
.modal-leave-active {
  transition: opacity 300ms ease-in-out, transform 200ms ease;
}

.modal-enter-to,
.modal-leave {
  opacity: 1;
  transform: translateY(0);
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media screen and (max-width: 767px) {
  #modal {
    width: 280px;
    margin-left: -140px;
    top: 72px;
  }
}
</style>
