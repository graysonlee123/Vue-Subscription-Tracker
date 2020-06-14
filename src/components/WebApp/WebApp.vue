<template>
  <div id="app-container">
    <div id="nav-menu" v-on:showMobileMenu="toggleMenu">
      <navigation />
    </div>
    <router-view />
  </div>
</template>

<script>
import { EventBus } from "../../EventBus";
import Navigation from "./Navigation";

EventBus.$on("showMobileMenu", () => {
  document.getElementById("nav-menu").classList.toggle("show-menu");
});

export default {
  data: function() {
    return {
      showMobileMenu: function() {}
    };
  },
  methods: {
    toggleMenu: function() {
      console.log("yep");
      if (this.showMobileMenu) {
        this.showMobileMenu = false;
      } else {
        this.showMobileMenu = true;
      }
    }
  },
  components: {
    navigation: Navigation
  }
};
</script>

<style lang="scss">
$nav-width: 260px;

$rightWidthDesktop: 36%;
$rightWidthMobile: 70%;

#app-container {
  #nav-menu {
    width: $nav-width;
    height: 100%;
    position: absolute;
    left: -1 * $nav-width;
    top: 0;

    background-color: white;
    border-right: 1px solid grey;

    &.show-menu {
      left: 0;
    }
  }

  #left {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  #right {
    width: $rightWidthMobile;
    height: 100%;
    position: absolute;
    right: -1 * $rightWidthMobile;
    top: 0;
  }
  
  // Break for right menu
  @media screen and (min-width: 920px) {
    #right {
      right: 0;
      width: $rightWidthDesktop;
    }

    #left {
      right: $rightWidthDesktop;
    }
  }

  // Break for nav
  @media screen and (min-width: 1020px) {
    #show-menu-btn {
      display: none;
    }

    #nav-menu {
      left: 0;
    }

    #left {
      left: $nav-width;
    }
  }
}
</style>