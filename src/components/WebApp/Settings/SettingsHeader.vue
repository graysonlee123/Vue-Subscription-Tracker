<template>
  <div class="settingsHeader">
    <div class="settingsHeader__text">
      <h2>
        <slot>Settings?</slot>
      </h2>
      <a @click="handleClose">
        <img src="@/assets/close.svg" alt="Close" />
      </a>
    </div>
    <div class="divider"></div>
    <settings-nav/>
    <div class="divider"></div>
  </div>
</template>

<script>
import SettingsNav from "./SettingsNav";

export default {
  components: {
    SettingsNav
  },
  methods: {
    handleClose() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style lang="scss" scoped>
.settingsHeader {
  margin-bottom: 2em;
}

.settingsHeader__text {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider {
  margin-top: 1em;
  margin-bottom: 1em;
  height: 3px;
  background-color: var(--bodyBackground);
}

h2 {
  font-size: 32px;
  color: #8369fe;
}

a {
  cursor: pointer;
}
</style>