<template>
  <div id="app-container" :class="{ leftMenuOpened: showLeftNav, rightPaneOpened: showRightPane }">
    <div id="nav-background-listener" @click="showLeftNav = false"></div>
    <transition name="slideToRight" mode="in-out">
      <navigation v-if="showLeftNav"/>
    </transition>
    <transition name="page" mode="out-in">
      <router-view
        @toggleMenu="() => this.showLeftNav ? this.showLeftNav = false : this.showLeftNav = true"
        @closeRightMenu="() => this.showRightPane = false"
      />
    </transition>
  </div>
</template>

<script>
import Navigation from "./Navigation";
import $ from "jquery";

// Width in px for different menu logic to take over
const desktopBreak = 1020;

export default {
  data: function () {
    return {
      showLeftNav: true,
      showRightPane: false,
    };
  },
  methods: {
    checkWidth: function () {
      const width = $(document).width();

      if (width <= desktopBreak) {
        this.showLeftNav = false;
      }
    },
    checkRightPane: function () {
      // Checks to see if we need to open the right pane on mobile

      if (this.$route.name === "Subscription") {
        this.showRightPane = true;
      } else if (this.$route.name === "New Subscription") {
        this.showRightPane = true;
      } else {
        this.showRightPane = false;
      }
    },
  },
  components: {
    navigation: Navigation,
  },
  beforeMount: function () {
    this.checkWidth();
  },
  watch: {
    $route: function () {
      this.checkRightPane();
    },
  },
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

  &.rightPaneOpened {
    #right {
      right: 0px;
    }
  }

  &.leftMenuOpened {
    #nav-background-listener {
      display: block;
    }
  }
}

#dashboard-wrapper {
  width: 100%;
  height: 100%;
}

#right {
  height: 100%;
  font-size: 1rem;
  background-color: $backgroundColor;
  padding: 0;
  overflow: hidden;
  position: fixed;
  right: -100%;
  top: 0;
  width: 100%;
}

#left {
  height: 100%;
  font-size: 1rem;
  background-color: $backgroundColor;
  padding: 1.2em;
  position: relative;
}

#nav-menu {
  width: $navWidth;
  border-right: $borderStyle;
  background: $menuColor;
}

#nav-background-listener {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  // Only display when "leftMenuOpened" is active class
  display: none;
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
    #dashboard-wrapper {
      padding-left: $navWidth;
    }
  }

  #dashboard-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;

    #right {
      position: static;
      border-left: $borderStyle;
    }
  }

  #app-container.leftMenuOpened #nav-background-listener {
    display: none;
  }
}
</style>