<template>
  <button class="optionsButton" @click="visible = true" ref="sortMenu" data-name="visible">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 8V6H21V8H3ZM3 13H21V11H3V13ZM3 18H21V16H3V18Z"
        :fill="iconColor"
        :fill-opacity="iconOpacity"
      />
    </svg>
    <div v-if="visible" class="optionsButton__fullscreenDarken" data-ignoreclickaway="true"></div>
    <ul class="optionsButton__menu" v-if="visible">
      <li class="optionsButton__option optionsButton__option--header">Options</li>
      <li class="optionsButton__option" @click="handleChangeShowTime">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.58997 20 4 16.41 4 12C4 7.59003 7.58997 4 12 4C16.41 4 20 7.59003 20 12C20 16.41 16.41 20 12 20ZM11 7H12.5V12.2L17 14.9L16.2 16.2L11 13V7Z"
            fill="black"
            fill-opacity="1"
          />
        </svg>
        <span>{{showTime ? 'Hide': 'Show'}} time until next payment</span>
      </li>
      <router-link tag="li" to="/settings/account" class="optionsButton__option">
        <img :src="avatarUrl" alt="Avatar" />
        <span>Edit account</span>
      </router-link>
      <li class="optionsButton__option" @click="handleLogout">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48001 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48001 17.52 2 12 2ZM4 12C4 7.57999 7.58 4 12 4C13.85 4 15.55 4.63 16.9 5.69L5.69 16.9C4.63 15.55 4 13.85 4 12ZM7.1 18.31C8.45 19.37 10.15 20 12 20C16.42 20 20 16.42 20 12C20 10.15 19.37 8.45001 18.31 7.10001L7.1 18.31Z"
            fill="black"
            fill-opacity="1"
          />
        </svg>
        <span>Logout</span>
      </li>
      <li class="optionsButton__option">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.5 3.5H13.5L13.9 5.5H19.5V15.5H12.5L12.1 13.5H6.5V20.5H4.5V3.5ZM12.26 7.5L11.86 5.5H6.5V11.5H13.74L14.14 13.5H17.5V7.5H12.26Z"
            fill="black"
            fill-opacity="1"
          />
        </svg>
        <span>Feedback</span>
      </li>
    </ul>
  </button>
</template>

<script>
import { clickAway } from "../../../mixins/clickAway";

export default {
  mixins: [clickAway],
  props: {
    iconColor: {
      type: String,
      default: "#fff",
    },
    iconOpacity: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    async handleLogout() {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    },
    handleChangeShowTime() {
      this.$store.dispatch("changeShowTime");
    }
  },
  computed: {
    avatarUrl() {
      return this.$store.getters.avatarUrl;
    },
    showTime() {
      return this.$store.state.preferences.showTime;
    }
  },
  watch: {
    $route() {
      // Close menu if we are navigating around
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.optionsButton {
  background: none;
  border: none;
  margin: 0;
  padding: 6px;
  cursor: pointer;

  .optionsButton__icon {
    width: 24px;
    height: 24px;
  }
}

.optionsButton__fullscreenDarken {
  z-index: 1010;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.optionsButton__menu {
  z-index: 1020;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--containerBackground);
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-shadow: 0 8px 4px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  text-align: left;

  .optionsButton__option {
    padding: 0.6rem 1.6rem;
    line-height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &.optionsButton__option--header {
      font-size: 1.2em;
      font-weight: bold;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    img,
    svg {
      margin-right: 12px;
    }

    span {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>