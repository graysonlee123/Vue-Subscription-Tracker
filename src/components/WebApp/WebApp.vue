<template>
  <div id="app-container">
    <div id="nav-menu" class="menu-container">
      <navigation />
    </div>
    <router-view @showNav="() => this.showNavigation = true" @showForm="handleShowRight" />
  </div>
</template>

<script>
import { EventBus } from "../../EventBus";
import Navigation from "./Navigation";
import $ from "jquery";

export default {
  data: function() {
    return {
      showNavigation: false,
      showRight: false
    };
  },
  methods: {
    toggleMenu: function(bool) {
      this.showNavigation = bool;
    },
    handleShowRight: function() {
      this.showRight ? (this.showRight = false) : (this.showRight = true);
    }
  },
  components: {
    navigation: Navigation
  },
  watch: {
    showNavigation: function(bool) {
      switch (bool) {
        case true:
          document.getElementById("app-container").classList.add("show-nav");
          break;
        case false:
          document.getElementById("app-container").classList.remove("show-nav");
          break;
        default:
          document.getElementById("app-container").classList.toggle("show-nav");
          break;
      }
    },
    showRight: function(bool) {
      switch (bool) {
        case true:
          document.getElementById("app-container").classList.add("show-item");
          break;
        case false:
          document
            .getElementById("app-container")
            .classList.remove("show-item");
          break;
        default:
          document
            .getElementById("app-container")
            .classList.toggle("show-item");
          break;
      }
    }
  },
  created: function() {
    $(document).on("click", event => {
      // ? Needs to be an arrow function to
      // ? retain binding of this to vue component
      if (
        !$(event.target).closest(".menu-container").length &&
        !$(event.target).closest("#show-menu-btn").length
      ) {
        this.toggleMenu(false);
      }
    });
  }
};
</script>

<style lang="scss">
$navWidth: 260px;

$rightWidthDesktop: 36%;
$rightWidthMobile: 70%;

$borderStyle: 1px solid grey;

#app-container {
  height: 100%;

  &.show-nav #nav-menu {
    left: 0;
  }

  &.show-item #right {
    right: 0;
  }
}

#right {
  width: $rightWidthMobile;
  height: 100%;
  position: fixed;
  top: 0;
  right: -1 * $rightWidthMobile;
}

#left {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

#nav-menu {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: -1 * 100%;
  transition: left 300ms ease;
  display: flex;

  nav {
    height: 100%;
    width: $navWidth;
    background: #fff;
    border-right: $borderStyle;
    z-index: 5;
  }

  #nav-background {
    z-index: 4;
    flex-grow: 1;
  }
}

@media screen and (min-width: 767px) {
  #left {
    width: 100% - $rightWidthDesktop;
  }

  #right {
    width: $rightWidthDesktop;
    right: 0;
  }
}
</style>