<template>
  <div id="main-menu">
    <span class="logout" @click="handleLogout()">Logout</span>
    <div class="options__wrapper" :class="{isOpen: showOptions}">
      <div class="options__clickZone" @click="toggleMenu()">
        <img class="avatar" src="https://via.placeholder.com/200?text=GG" alt="Avatar" />
        <img class="icon" src="/assets/sort-arrow.svg" alt="Avatar" />
      </div>
      <ul class="options__menu" v-if="showOptions">
        <router-link to="/dashboard/settings/account" tag="li">Account</router-link>
        <router-link to="/dashboard/settings/preferences" tag="li">Preferences</router-link>
        <router-link to="/dashboard/settings/password" tag="li">Password</router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      showOptions: false,
    };
  },
  methods: {
    handleLogout: function () {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    },
    toggleMenu: function (bool) {
      if (typeof bool === "boolean") {
        // Menu logic if a specific option is passed
      } else {
        // Just toggle the menu
        this.showOptions
          ? (this.showOptions = false)
          : (this.showOptions = true);
      }
    },
  },
};
</script>

<style lang="scss">
#main-menu {
  background-color: var(--containerBackground);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2em;

  .logout {
    cursor: pointer;
    margin-right: 1.2em;
    font-size: 0.9em;
    font-weight: bold;
  }

  .options__wrapper {
    position: relative;

    .options__clickZone {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.2em 0.6em;
    }

    &:hover,
    &.isOpen {
      border-radius: var(--borderRadius);
      background-color: rgba(0, 0, 0, 0.07);
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.8em;
    }

    .icon {
      width: 10px;
      height: 10px;
      transform: rotate(180deg);
    }

    .options__menu {
      position: absolute;
      right: 0;
      top: 24px;
      border-radius: var(--borderRadius);
      background-color: var(--containerBackground);
      box-shadow: 0 3px 16px rgba(0, 0, 0, 0.2);

      li {
        padding: 1em 2em;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.07);
        }
      }
    }
  }
}
</style>