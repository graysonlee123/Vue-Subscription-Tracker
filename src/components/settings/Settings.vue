<template>
  <div id="settings">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
  #settings {
    height: 100%;
    max-height: 100%;
    overflow: scroll;
    background-color: var(--containerBackground);
  }
</style>