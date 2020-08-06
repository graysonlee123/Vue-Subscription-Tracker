<template>
  <div id="dashboard">
    <navigation />
    <main-menu />
    <router-view></router-view>
  </div>
</template>

<script>
import moment from "moment";
import Navigation from "./Navigation";
import MainMenu from "./MainMenu";

export default {
  data: function () {
    return {
      loading: false,
      error: false,
    };
  },
  components: {
    navigation: Navigation,
    mainMenu: MainMenu
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
</style>