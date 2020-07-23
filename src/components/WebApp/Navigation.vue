<template>
  <nav id="nav-menu" class="menu-container">
    <router-link class="nav-header" to="/app/settings">
      <div class="avatar-wrapper">
        <img src="https://via.placeholder.com/200" alt="avatar" />
      </div>
      <p>{{fullName}}</p>
    </router-link>
    <ul class="nav-filters">
      <li>
        <router-link to="/app/dashboard/all">
          <i class="fa fa-check"></i>
          <p>All</p>
          <span>1</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/dashboard/today">
          <i class="fa fa-check"></i>
          <p>Today</p>
          <span>1</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/dashboard/week">
          <i class="fa fa-check"></i>
          <p>This Week</p>
          <span>2</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/dashboard/month">
          <i class="fa fa-check"></i>
          <p>This Month</p>
          <span>4</span>
        </router-link>
      </li>
    </ul>
    <hr />
    <ul>
      <li @click="handleToggleMenu" class="close">Close Menu</li>
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
    handleLogout: function () {
      this.$store.dispatch("logout").finally(() => {
        this.$router.push("/login");
      });
    },
    handleToggleMenu: function () {
      this.$emit("toggleMenu", false);
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
#nav-menu {
  font-size: 0.8rem;
  height: 100%;
  z-index: 5;
  padding: 1rem;
  position: absolute;
  left: 0;

  nav {
    height: 100%;
  }

  #nav-background {
    z-index: 4;
    flex-grow: 1;
  }
}

.nav-header {
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  .avatar-wrapper {
    $size: 48px;

    width: $size;
    height: $size;
    border-radius: $size / 2;
    overflow: hidden;
    margin-right: 0.8em;

    img {
      width: 100%;
      height: auto;
    }
  }

  p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    padding: 0.8em;
    text-transform: capitalize;
  }
}

.nav-filters {
  li {
    a {
      display: flex;
      opacity: 1;
      padding: 0.8em;
      border-radius: 5px;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.6);

      i {
        margin-right: 0.8em;
      }

      p {
        flex-grow: 1;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    &.active {
      a {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.2);

        p {
          font-weight: bold;
        }
      }
    }
  }
}
</style>