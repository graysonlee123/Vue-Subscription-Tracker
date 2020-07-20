<template>
  <div id="app-container" :class="{ leftMenuOpened: showLeftNav }">
    <transition name="slideToRight" mode="in-out">
      <navigation
        v-if="showLeftNav"
        @toggleMenu="() => this.showLeftNav ? this.showLeftNav = false : this.showLeftNav = true"
      />
    </transition>
    <transition name="page" mode="out-in">
      <router-view
        @toggleMenu="() => this.showLeftNav ? this.showLeftNav = false : this.showLeftNav = true"
        @showItem="() => this.showItemOnMobile = true"
      />
    </transition>
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
      showItemOnMobile: false,
      showLeftNav: false
    };
  },
  methods: {},
  components: {
    navigation: Navigation
  },
  watch: {
    // showMenu: function(bool) {
    //   switch (bool) {
    //     case true:
    //       document.getElementById("app-container").classList.add("show-nav");
    //       break;
    //     case false:
    //     default:
    //       document.getElementById("app-container").classList.remove("show-nav");
    //       break;
    //   }
    // },
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
    // $(document).on("click", event => {
    //   // ? Needs to be an arrow function to
    //   // ? retain binding of this to vue component
    //   if (
    //     $(window).width() <= desktopBreak &&
    //     !$(event.target).closest(".menu-container").length &&
    //     !$(event.target).closest("#show-menu-btn").length
    //   ) {
    //     this.showMenu = false;
    //   }
    //   if (
    //     !$(event.target).closest("#right").length &&
    //     !$(event.target).closest(".subscription-preview-card").length &&
    //     !$(event.target).closest(".new-subscription-wrapper").length
    //   ) {
    //     this.showItemOnMobile = false;
    //   }
    // });
    // Initial check for desktop or mobile
    // if ($(window).width() > desktopBreak) {
    //   this.showMenu = true;
    // }
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

body {
  background-color: $backgroundColor;
}

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

#page-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#right {
  font-size: 1rem;
  height: 100%;
  background-color: $backgroundColor;
  padding: 0;
  border-left: $borderStyle;
  overflow: hidden;
}

#left {
  font-size: 1rem;
  background-color: $backgroundColor;
  padding: 1.2em;
}

#nav-menu {
  font-size: 0.8rem;
  width: $navWidth;
  height: 100%;
  z-index: 5;
  display: flex;
  border-right: $borderStyle;
  padding: 1rem;
  background: $menuColor;
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

// Global Stuff

.spinner-container {
  height: 100%;
  display: grid;
  place-items: center;
}

.spinner {
  border: 2px solid #fff;
  border-top: 2px solid #333;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s ease-in-out infinite;
}

// Transitions

.page-enter-active,
.page-leave-active {
  transition: opacity 300ms ease;
}

.page-enter-to,
.page-leave {
  opacity: 1;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.slideToRight-enter-active,
.slideToRight-leave-active {
  transition: transform 200ms ease, opacity 100ms ease-in-out;
}

.slideToRight-enter-to,
.slideToRight-leave {
  transform: translateX(0px);
  opacity: 1;
}

.slideToRight-enter,
.slideToRight-leave-to {
  transform: translateX(-1 * $navWidth);
  opacity: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (min-width: 767px) {
  #app-container.leftMenuOpened {
    #page-wrapper {
      padding-left: $navWidth;
    }
  }
}
</style>