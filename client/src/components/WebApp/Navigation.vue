<template>
  <nav id="navigation" class="menu-container">
    <ul>
      <router-link to="/dashboard" tag="li">
        <i aria-hidden="true" class="fas fa-house-user"></i>
      </router-link>
      <router-link to="/favorites" tag="li">
        <i aria-hidden="true" class="fa fa-star"></i>
      </router-link>
      <router-link to="/trash" tag="li">
        <i aria-hidden="true" class="fa fa-trash"></i>
      </router-link>
      <router-link to="/dashboard/settings" tag="li">
        <i aria-hidden="true" class="fa fa-cog"></i>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  data: function () {
    return {
      tagsAccordionOpen: true,
    };
  },
  methods: {
    handleLogout: function () {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    },
    handleTagsAccordion: function () {
      this.tagsAccordionOpen = !this.tagsAccordionOpen;
    },
  },
  computed: {
    fullName: function () {
      const firstName = this.$store.state.user.first_name;
      const lastName = this.$store.state.user.last_name;

      return `${firstName} ${lastName}`;
    },
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

    &.router-link-active {
      background-color: var(--mainAccentFaint);
      color: var(--mainAccent);
      border-left-color: var(--mainAccent);
    }
  }
}
</style>