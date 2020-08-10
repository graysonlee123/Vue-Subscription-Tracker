<template>
  <div class="settings__container">
    <div class="settings__form">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error, please try again later.</div>
      <div v-else>
        <h1 class="settingsTitle">Account</h1>
        <div class="settingsNav">
          <ul class="settingsNav__links">
            <router-link class="settingsNav_link" to="/dashboard/settings/preferences" tag="li">Preferences</router-link>
            <router-link class="settingsNav_link" to="/dashboard/settings/account" tag="li">Account</router-link>
            <router-link class="settingsNav_link" to="/dashboard/settings/password" tag="li">Password</router-link>
            <router-link class="settingsNav_link" to="/dashboard/settings/advanced" tag="li">Advanced</router-link>
          </ul>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <div class="settingsSubmit_wrapper">
      <button @click="handleSubmit()">
        <i class="fa fa-save"></i> Update
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loading: true,
      error: false,
    };
  },
  created: function () {
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.settings__container {
  max-height: 100%;
  width: 100%;
  max-width: 596px;
  margin: 2em auto;
  display: flex;
  flex-flow: column nowrap;

  .settings__form {
    overflow-y: auto;
    border-radius: var(--borderRadius);
    background-color: var(--containerBackground);
    width: 100%;
    padding: 2em;
    flex-grow: 1;
    margin-bottom: 2em;
  }

  .settingsSubmit_wrapper {
    text-align: center;

    button {
      background: none;
      background-color: var(--success);
      border: none;
      border-radius: 50px;
      padding: 12px 28px;
      color: #eef6ed;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: bold;
    }
  }
}

.settingsNav {
  border-bottom: 3px solid var(--bodyBackground);
  margin: 1em -2em 0 -2em;
  padding: 0 2em;

  ul {
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
</style>