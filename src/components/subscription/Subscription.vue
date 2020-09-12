<template>
  <div id="subscription">
    <router-view class="subscription__content"></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#subscription {
  height: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 1rem;
  background-color: var(--containerBackground);
}

.subscription__content {
  margin-bottom: 1rem;
}
</style>