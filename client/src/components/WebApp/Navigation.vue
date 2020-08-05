<template>
  <nav id="nav-menu" class="menu-container">
    <router-link class="nav-header" to="/app/settings">
      <div class="avatar-wrapper">
        <img src="https://via.placeholder.com/200" alt="avatar" />
      </div>
      <p>{{fullName}}</p>
    </router-link>
    <ul class="quick-links">
      <router-link to="/app/dashboard" tag="li">
        <i class="fa fa-book"></i>
        <p>Subscriptions</p>
        <span>2</span>
      </router-link>
      <router-link to="/app/dashboard/subscription/new" tag="li">
        <i class="fa fa-plus-circle"></i>
        <p>Add New</p>
      </router-link>
    </ul>
    <hr />
    <div class="tags" :class="{ 'is-open': tagsAccordionOpen }">
      <div class="tags-header" @click="handleTagsAccordion()">
        <i class="fas fa-chevron-down"></i>
        <p>Tags</p>
      </div>
      <ul class="tags-list" v-if="tagsAccordionOpen">
        <li>
          <i class="fa fa-bars"></i>
          <p>Freelance</p>
          <span style="background-color: green;"></span>
        </li>
        <li>
          <i class="fa fa-plus-circle"></i>
          <p>Add Tag</p>
        </li>
      </ul>
    </div>
    <hr />
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
    flex-shrink: 0;

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
    font-size: 1.1em;
  }
}

hr {
  margin: 1em 0;
  border-color: rgba(255, 255, 255, 0.2);
}

.quick-links {
  li {
    display: flex;
    padding: 1em;
    border-radius: 5px;
    cursor: pointer;

    i {
      margin-right: 0.8em;
    }

    p {
      flex-grow: 1;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.router-link-exact-active {
      background-color: rgba(255, 255, 255, 0.2);

      p {
        font-weight: bold;
      }
    }
  }
}

.tags {
  .tags-header {
    display: flex;
    font-size: 1em;
    padding: 0.4em 1em;
    margin-bottom: 1em;
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;

    i {
      margin-right: 0.8em;
    }

    p {
      flex-grow: 1;
      font-weight: bold;
    }
  }

  .tags-list {
    li {
      display: flex;
      align-items: center;
      padding: 1em;
      border-radius: 5px;
      cursor: pointer;

      i {
        margin-right: 1em;
      }

      p {
        flex-grow: 1;
      }

      span {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.router-link-active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &.is-open {
    .tags-header i {
      transform: rotate(180deg);
    }
  }
}
</style>