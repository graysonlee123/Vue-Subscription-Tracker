<template>
  <div>
    <navigation/>
    <div>I am the main app! Add navigation bar and main container here</div>
    <router-view />
  </div>
</template>

<script>
import Navigation from "./Navigation";

export default {
  components: {
    navigation: Navigation
  }
};
</script>