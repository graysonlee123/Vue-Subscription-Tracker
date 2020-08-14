<template>
  <div id="dashboard">
    <navigation />
    <main-menu />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import moment from 'moment';
import Navigation from './Navigation';
import MainMenu from './MainMenu';

export default {
  data() {
    return {
      loading: false,
      error: false,
    };
  },
  components: {
    navigation: Navigation,
    mainMenu: MainMenu,
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
  opacity: 1
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
