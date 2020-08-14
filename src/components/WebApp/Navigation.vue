<template>
  <nav id="navigation" class="menu-container">
    <ul>
      <router-link to="/dashboard" tag="li" class="dashboard__link">
        <i aria-hidden="true" class="fas fa-house-user"></i>
      </router-link>
      <router-link to="/dashboard/subscription" class="new__link" tag="li">
        <i aria-hidden="true" class="fa fa-plus"></i>
      </router-link>
      <router-link to="/dashboard/settings" class="settings__link" tag="li">
        <i aria-hidden="true" class="fa fa-cog"></i>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#navigation ul {
  li {
    height: 80px;
    display: grid;
    place-items: center;
    border: 5px solid transparent;
    cursor: pointer;

    &.dashboard__link.router-link-exact-active,
    &.settings__link.router-link-active,
    &.new__link.router-link-active {
      background-color: var(--mainAccentFaint);
      color: var(--mainAccent);
      border-left-color: var(--mainAccent);
    }

    &:hover {
      background-color: var(--mainAccentFaint);
    }
  }
}
</style>
