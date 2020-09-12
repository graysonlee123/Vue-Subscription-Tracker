<template>
  <div class="settingsHeader">
    <div class="settingsHeader__text">
      <h1>
        <slot></slot>
      </h1>
      <a @click="handleClose">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L13 13" stroke="#829fae" stroke-width="2" stroke-linecap="round" />
          <path d="M1 13L13 0.999999" stroke="#829fae" stroke-width="2" stroke-linecap="round" />
        </svg>
      </a>
    </div>
    <div class="divider"></div>
    <settings-nav />
    <div class="divider"></div>
  </div>
</template>

<script>
import SettingsNav from "./SettingsNav";

export default {
  components: {
    SettingsNav,
  },
  methods: {
    handleClose() {
      this.$router.push("/dashboard");
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
  padding: 1.6rem 1.6rem 0;
}

.divider {
  margin-top: 1em;
  margin-bottom: 1em;
  height: 3px;
  background-color: var(--bodyBackground);
}

a {
  cursor: pointer;
}
</style>