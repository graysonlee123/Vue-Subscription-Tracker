<template>
  <div id="app-container" :class="{ 'nav-open': showNav, 'panel-open': showPanel }">
    <navigation />
    <transition name="page" mode="out-in">
      <router-view
        @toggleMenu="() => this.showNav ? this.showNav = false : this.showNav = true"
      />
    </transition>
  </div>
</template>

<script>
import Navigation from "./Navigation";
import $ from "jquery";

// Width in px for different menu logic to take over
const navBreak = 1200;
const panelBreak = 920;

export default {
  data: function () {
    return {
      showNav: true,
      showPanel: false,
    };
  },
  methods: {
    checkWidth: function () {
      const width = $(document).width();

      if (width <= navBreak) {
        this.showNav = false;
      }
    },
    checkPanelLogic: function() {
      // Open the right menu on these pages
      const showPanelOn = ["View Subscription", "New Subscription", "Edit Subscription"];
  
      if (showPanelOn.includes(this.$route.name)) {
        this.showPanel = true;
      } else {
        this.showPanel = false;
      }
    }
  },
  components: {
    navigation: Navigation,
  },
  beforeMount: function () {
    this.checkWidth();
  },
  watch: {
    $route: function () {
      this.checkPanelLogic();
    },
  },
  created: function () {
    // Navigation click off listener
    $(document).click((e) => {
      const $nav = $("#nav-menu");
      const $navMenu = $("#show-menu-btn");

      if (
        // If it isn't the nav itself
        !$nav.is(e.target) &&
        // And it's not a child of the nav component
        $nav.has(e.target).length === 0 &&
        // And it's not the open menu button
        $navMenu.has(e.target).length === 0 &&
        // And it's not a child of the open menu button
        !$navMenu.is(e.target) &&
        // And we're in the CSS breakpoint
        $(document).width() < navBreak
      ) {
        this.showNav = false;
      }
    });

    // Check if panel should be open
    this.checkPanelLogic();
  },
};
</script>

<style lang="scss">
$navWidth: 260px;
$navBreak: 1200px;
$navTransitionDuration: 600ms;

$panelWidth: 460px;
$panelBreak: 920px;
$panelBreakSm: 484px;
$panelTransitionDuration: 300ms;

$borderStyle: 1px solid grey;
$backgroundColor: #1c1d1f;

#app-container {
  height: 100%;
  color: #fafafa;
  transition: padding-left $navTransitionDuration + 200 ease;
  background-color: $backgroundColor;

  #nav-menu {
    width: $navWidth;
    height: 100%;
    position: absolute;
    left: -1 * $navWidth;
    padding: 1rem;
    font-size: 0.8rem;
    border-right: $borderStyle;
    background: #27282a;
    z-index: 5;
    user-select: none;
    opacity: 0;
    transition: opacity 400ms ease, left $navTransitionDuration ease;
  }

  #dashboard-wrapper {
    width: 100%;
    height: 100%;

    #left {
      position: relative;
      padding: 1.2em;
      font-size: 1rem;
      height: 100%;
    }

    #right {
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      right: -1 * $panelWidth;
      padding: 0;
      font-size: 1rem;
      overflow: hidden;
      background-color: $backgroundColor;
      transition: opacity 400ms ease, right $panelTransitionDuration ease;
      opacity: 0;
    }
  }

  &.nav-open {
    #nav-menu {
      left: 0;
      opacity: 1;
    }
  }

  &.panel-open {
    #dashboard-wrapper {
      #right {
        right: 0;
        opacity: 1;
      }
    }
  }

  @media screen and (min-width: $navBreak) {
    &.nav-open {
      padding-left: $navWidth;
      transition-duration: $navTransitionDuration - 200;
    }
  }

  @media screen and (min-width: $panelBreak) {
    #dashboard-wrapper {
      display: grid;
      grid-template-columns: auto $panelWidth;

      #right {
        position: static;
        border-left: $borderStyle;
        opacity: 1;
      }
    }
  }

  @media screen and (min-width: $panelBreakSm) {
    #dashboard-wrapper {
      #right {
        width: $panelWidth;
        border-left: $borderStyle;
      }
    }
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>