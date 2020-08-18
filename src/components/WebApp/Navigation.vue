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
  methods: {
    // @param   e    Event
    clickAway(e) {
      // Important to put ref="" on menu element parent / container
      // and also data-name="" for the name of the dropdown's visibility state

      const target = e.target;
      const el = document.getElementById("navigation");
      const hamburger = document.getElementsByClassName("mobileNavigation")[0];

      if (
        el !== target &&
        !el.contains(target) &&
        el !== hamburger &&
        !hamburger.contains(target)
      ) {
        this.$emit("toggle-mobile-menu", false);
        console.log('close menu')
      }
    },
  },
  created() {
    document.addEventListener("click", this.clickAway);
  },
  destroyed() {
    document.removeEventListener("click", this.clickAway);
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
