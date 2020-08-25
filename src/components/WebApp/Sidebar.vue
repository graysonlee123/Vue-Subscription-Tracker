<template>
  <div>
    <div id="sidebarDark" @click="handleClose"></div>
    <div id="sidebar">
      <router-view class="sidebar__content"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClose(e) {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style lang="scss" scoped>
$width: 620px;

#sidebarDark {
  position: fixed;
  width: calc(100% - #{$width});
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(43, 46, 51, 0.2);
}

#sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: $width;
  height: 100%;
  padding: 4rem 4rem 0;
  background-color: var(--containerBackground);
  overflow-y: auto;
}

.sidebar__content {
  margin-bottom: 2em;
}

@media screen and (max-width: 767px) {
  #sidebarDark {
    display: none;
  }

  #sidebar {
    width: 100%;
    padding: 1em 1em 0;
  }

  .sidebar__content {
    margin-bottom: 1em;
  }
}
</style>