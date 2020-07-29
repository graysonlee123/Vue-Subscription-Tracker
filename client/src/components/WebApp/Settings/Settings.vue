<template>
  <div id="settings-wrapper">
    <div class="settings-container">
      <div class="settings-actions">
        <div id="settings-hamburger" @click="toggleNav">
          <i class="fa fa-bars"></i>
        </div>
        <h2>Settings</h2>
        <div class="done-button">Done</div>
      </div>
      <nav id="settings-nav" :class="{'nav-open': navOpen}">
        <ul>
          <router-link to="/app/settings/preferences" tag="li">Preferences</router-link>
          <router-link to="/app/settings/profile" tag="li">Profile</router-link>
          <router-link to="/app/settings/support" tag="li">Support</router-link>
        </ul>
      </nav>
      <main class="menu-item">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

const navBreak = 991;

export default {
  data: function () {
    return {
      navOpen: false,
    };
  },
  methods: {
    toggleNav: function () {
      this.navOpen ? (this.navOpen = false) : (this.navOpen = true);
    },
  },
  created: function () {
    // Listen for clicks outside of navigation menu on mobile
    $(document).click((e) => {
      const $nav = $("#settings-nav");
      const $hamburger = $("#settings-hamburger");

      if (
        // If it isn't the nav itself
        !$nav.is(e.target) &&
        // And it's not a child of the nav component
        $nav.has(e.target).length === 0 &&
        // And it's not the open menu button
        $hamburger.has(e.target).length === 0 &&
        // And it's not a child of the open menu button e.g. the icon
        !$hamburger.is(e.target) &&
        // And we're in the CSS breakpoint
        $(document).width() < navBreak
      ) {
        this.navOpen = false;
      }
    });

    // TODO: Fine where the user came from and send them back on hitting DONE
  },
};
</script>

<style lang="scss" scoped>
$navWidth: 280px;
$navBreak: 991px;

#settings-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1d1d1f;
  z-index: 6;
  font-size: 0.9rem;

  .settings-container {
    width: 100%;
    max-width: $navBreak;
    height: 100%;
    margin: auto;
    max-height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;

    .settings-actions {
      display: flex;
      align-items: center;
      padding: 2em;

      #settings-hamburger {
        margin-right: 0.8em;
        font-size: 1.2em;
      }

      h2 {
        font-size: 1.5em;
        flex-grow: 1;
      }

      .done-button {
        background-color: cadetblue;
        padding: 0.8em 1.6em;
        cursor: pointer;
      }
    }
  }

  nav {
    position: absolute;
    top: 0;
    left: -1 * $navWidth;
    width: $navWidth;
    height: 100%;
    border-right: 1px solid gray;
    background-color: #1d1d1f;
    transition: left 300ms ease, opacity 200ms ease;
    box-shadow: 4px 16px 16px rgba(0, 0, 0, 0.3);
    opacity: 0;
    color: #6f6f6f;
    font-weight: bold;
    padding: 1em 0;

    li {
      padding: 1em 2em;

      &.router-link-exact-active {
        border-left: 2px solid cadetblue;
      }
    }

    &.nav-open {
      left: 0;
      opacity: 1;
    }
  }

  main.menu-item {
    padding: 2em;
    border-top: 1px solid gray;
  }
}

@media screen and (min-width: $navBreak) {
  #settings-wrapper {
    padding: 2em;

    .settings-container {
      grid-template-columns: $navWidth auto;
      grid-template-rows: 100px auto;
      grid-template-areas:
        "actions actions"
        "nav main";

      .settings-actions {
        grid-area: actions;
        padding: 0 0 2em 0;

        #settings-hamburger {
          display: none;
        }
      }

      nav {
        grid-area: nav;
        overflow-y: auto;
        display: block;
        position: static;
        opacity: 1;
        box-shadow: none;
        border: 1px solid gray;
      }

      main {
        grid-area: main;
        overflow-y: auto;
        border: 1px solid gray;
        border-left: none;
      }
    }
  }
}
</style>