<template>
  <div id="dashboard" :class="{navVisibleMobile: navVisibleMobile}">
    <navigation @toggle-mobile-menu="toggleMenu" />
    <main-menu @toggle-mobile-menu="toggleMenu" />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import Navigation from "./Navigation";
import MainMenu from "./MainMenu";

export default {
  data() {
    return {
      loading: false,
      error: false,
      navVisibleMobile: false,
    };
  },
  methods: {
    toggleMenu(bool) {
      if (typeof bool === "boolean") {
        this.navVisibleMobile = bool;
      } else {
        this.navVisibleMobile = !this.navVisibleMobile;
      }
    },
  },
  components: {
    navigation: Navigation,
    mainMenu: MainMenu,
  },
  watch: {
    $route() {
      this.navVisibleMobile = false;
    },
  },
};
</script>

<style lang="scss">
#dashboard {
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas: "nav menu" "nav main";
  height: 100%;
  overflow: hidden;
}

#navigation {
  grid-area: nav;
  background-color: var(--containerBackground);
}

#main-menu {
  grid-area: menu;
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 767px) {
  #dashboard {
    grid-template-columns: 1fr;
    grid-template-areas: "menu" "main";

    &.navVisibleMobile {
      #navigation {
        left: 0;
      }
    }
  }

  #navigation {
    $width: 80px;

    position: fixed;
    bottom: 0;
    left: -1 * $width;
    z-index: 5;
    width: 80px;
    height: calc(100% - 80px);
    transition: left 300ms ease-in-out;
    border-right: 2px solid var(--bodyBackground);
  }

  #main-menu {
    border-bottom: 2px solid var(--bodyBackground);
  }
}
</style>
