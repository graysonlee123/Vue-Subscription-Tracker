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
  data: function () {
    return {
      showLeftNav: false,
    };
  },
  components: {
    navigation: Navigation,
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

body {
  background-color: $backgroundColor;
}

#app-container {
  height: 100%;
  color: #fafafa;
}

#dashboard-wrapper {
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
  width: $navWidth;
  border-right: $borderStyle;
  background: $menuColor;
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
}
</style>