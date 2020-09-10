<template>
  <div class="settingsNav">
    <router-link to="/settings/preferences" active-class="settingsNav__link--active" class="settingsNav__link">Preferences</router-link>
    <router-link to="/settings/account" active-class="settingsNav__link--active" class="settingsNav__link">Account</router-link>
    <router-link to="/settings/password" active-class="settingsNav__link--active" class="settingsNav__link">Password</router-link>
    <router-link to="/settings/advanced" active-class="settingsNav__link--active" class="settingsNav__link">Advanced</router-link>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
  .settingsNav {
    display: flex;
    flex-wrap: wrap;

    .settingsNav__link {
      text-decoration: none;
      color: inherit;
      padding-right: 1em;
      font-size: 0.8em;

      &.settingsNav__link--active {
        font-weight: bold;
      }
    }
  }
</style>