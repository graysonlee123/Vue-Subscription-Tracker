<template>
  <div id="app-container">
    <div id="nav-menu" class="menu-container">
      <navigation />
    </div>
    <router-view
      @toggleMenu="() => this.showMenu ? this.showMenu = false : this.showMenu = true"
      @showItem="() => this.showItemOnMobile = true"
    />
  </div>
</template>

<script>
import { EventBus } from "../../EventBus";
import Navigation from "./Navigation";
import $ from "jquery";

// Width in px for different menu logic to take over
const desktopBreak = 1020;

export default {
  data: function() {
    return {
      showMenu: false,
      showItemOnMobile: false
    };
  },
  methods: {},
  components: {
    navigation: Navigation
  },
  watch: {
    showMenu: function(bool) {
      switch (bool) {
        case true:
          document.getElementById("app-container").classList.add("show-nav");
          break;
        case false:
        default:
          document.getElementById("app-container").classList.remove("show-nav");
          break;
      }
    },
    showItemOnMobile: function(bool) {
      switch (bool) {
        case true:
          document.getElementById("app-container").classList.add("show-item");
          break;
        case false:
        default:
          document
            .getElementById("app-container")
            .classList.remove("show-item");
          break;
      }
    }
  },
  created: function() {
    // Listen for menu closures

    $(document).on("click", event => {
      // ? Needs to be an arrow function to
      // ? retain binding of this to vue component
      if (
        $(window).width() <= desktopBreak &&
        !$(event.target).closest(".menu-container").length &&
        !$(event.target).closest("#show-menu-btn").length
      ) {
        this.showMenu = false;
      }

      if (
        !$(event.target).closest("#right").length &&
        !$(event.target).closest(".subscription-preview-card").length &&
        !$(event.target).closest(".new-subscription-wrapper").length
      ) {
        this.showItemOnMobile = false;
      }
    });

    // Initial check for desktop or mobile

    if ($(window).width() > desktopBreak) {
      this.showMenu = true;
    }
  }
};
</script>

<style lang="scss">
$navWidth: 260px;

$rightWidthDesktop: 36%;
$rightWidthMobile: 70%;

$borderStyle: 1px solid grey;

$backgroundColor: #1c1d1f;
$menuColor: #27282a;

#app-container {
  height: 100%;
  color: #fafafa;

  &.show-nav #nav-menu {
    left: 0;
  }

  &.show-item #right {
    right: 0;
  }
}

#right {
  font-size: 1rem;
  width: $rightWidthMobile;
  height: 100%;
  position: fixed;
  top: 0;
  right: -1 * $rightWidthMobile;
  background-color: $backgroundColor;
  padding: 0;
  border-left: $borderStyle;
  overflow-y: auto;
  overflow-x: hidden;
}

#left {
  font-size: 1rem;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $backgroundColor;
  padding: 1.2em;
}

#nav-menu {
  font-size: 0.8rem;
  width: $navWidth;
  height: 100%;
  position: absolute;
  top: 0;
  left: -1 * 100%;
  z-index: 5;
  transition: left 300ms ease;
  display: flex;
  border-right: $borderStyle;
  padding: 1rem;
  background: $menuColor;

  nav {
    height: 100%;
  }

  #nav-background {
    z-index: 4;
    flex-grow: 1;
  }
}

@media screen and (min-width: 767px) {
  .show-nav {
    #left {
      left: $navWidth;
      width: calc((100% - #{$rightWidthDesktop}) - #{$navWidth});
    }
  }

  #left {
    width: 100% - $rightWidthDesktop;
  }

  #right {
    width: $rightWidthDesktop;
    right: 0;
  }
}
</style>