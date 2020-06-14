<template>
  <nav>
    <ul>
      <li>
        <router-link to="/app/dashboard">Dashboard</router-link>
      </li>
      <li>
        <router-link to="/app/account">Account</router-link>
      </li>
      <li>
        <router-link to="/app/settings">Settings</router-link>
      </li>
      <li>
        <span @click="handleLogout">Logout</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    handleLogout: function() {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>