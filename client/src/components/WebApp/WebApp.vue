<template>
  <div id="app-container" :class="{ 'nav-open': showNav, rightPaneOpened: showRightPane }">
    <navigation />
    <transition name="page" mode="out-in">
      <router-view
        @toggleMenu="() => this.showNav ? this.showNav = false : this.showNav = true"
        @closeRightMenu="() => this.showRightPane = false"
      />
    </transition>
  </div>
</template>

<script>
import Navigation from "./Navigation";
import $ from "jquery";

// Width in px for different menu logic to take over
const navBreak = 1200;

export default {
  data: function () {
    return {
      showNav: true,
      showRightPane: false,
    };
  },
  methods: {
    checkWidth: function () {
      const width = $(document).width();

      if (width <= navBreak) {
        this.showNav = false;
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
  },
};
</script>

<style lang="scss">
$navWidth: 260px;
$navBreak: 1200px;
$navTransitionDuration: 600ms;

$borderStyle: 1px solid grey;
$backgroundColor: #1c1d1f;

#app-container {
  height: 100%;
  color: #fafafa;
  transition: padding-left $navTransitionDuration + 200 ease;

  #nav-menu {
    width: $navWidth;
    height: 100%;
    position: absolute;
    left: -1 * $navWidth;
    padding: 1rem;
    font-size: 0.7rem;
    border-right: $borderStyle;
    background: #27282a;
    z-index: 5;
    user-select: none;
    opacity: 0;
    transition: opacity 400ms ease, left $navTransitionDuration ease;
  }

  &.rightPaneOpened {
  }

  &.nav-open {
    #nav-menu {
      left: 0;
      opacity: 1;
    }
  }

  @media screen and (min-width: $navBreak) {
    &.nav-open {
      padding-left: $navWidth;
      transition-duration: $navTransitionDuration - 200;
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

@media screen and (min-width: 767px) {
  #dashboard-wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;

    #right {
      position: static;
      border-left: $borderStyle;
    }
  }
}
</style>