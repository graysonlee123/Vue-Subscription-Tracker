<template>
  <div class="settings__container">
    <div class="settings__form">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error, please try again later.</div>
      <div v-else>
        <h1 class="settingsTitle">{{tabName}}</h1>
        <div class="settingsNav">
          <ul class="settingsNav__links">
            <router-link
              class="settingsNav_link"
              to="/dashboard/settings/preferences"
              tag="li"
            >Preferences</router-link>
            <router-link class="settingsNav_link" to="/dashboard/settings/account" tag="li">Account</router-link>
            <router-link
              class="settingsNav_link"
              to="/dashboard/settings/password"
              tag="li"
            >Password</router-link>
            <router-link
              class="settingsNav_link"
              to="/dashboard/settings/advanced"
              tag="li"
            >Advanced</router-link>
          </ul>
        </div>
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loading: true,
      error: false,
      tabName: "",
    };
  },
  watch: {
    $route: function () {
      this.tabName = this.$route.name;
    },
  },
  created: function () {
    this.loading = false;
    this.tabName = this.$route.name;
  },
};
</script>

<style lang="scss" scoped>
.settings__container {
  max-height: 100%;
  width: 100%;
  max-width: 596px;
  margin: 2em auto;

  .settings__form {
    overflow-y: auto;
    border-radius: var(--borderRadius);
    background-color: var(--containerBackground);
    width: 100%;
    height: 100%;
    padding: 2em;
    margin-bottom: 2em;
  }
}

.settingsNav {
  border-bottom: 3px solid var(--bodyBackground);
  margin: 1em -2em 0 -2em;
  padding: 0 2em;

  ul {
    user-select: none;
    
    li {
      display: inline;
      margin-right: 1.2em;
      line-height: 3em;
      padding-bottom: 16px;
      cursor: pointer;

      &.router-link-active {
        border-bottom: 3px solid var(--mainAccent);
        color: var(--textDark);
        font-weight: bold;
      }
    }
  }
}

// Transitions
.slide-enter-active,
.slide-leave-active {
  transition: opacity 300ms ease, transform 200ms ease-in-out;
}

.slide-enter-to,
.slide-leave {
  opacity: 1;
  transform: translateY(0px);
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>