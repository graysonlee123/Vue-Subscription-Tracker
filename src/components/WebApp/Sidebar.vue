<template>
  <div>
    <div id="sidebarDark" @click="handleClose"></div>
    <div id="sidebar">
      <router-view></router-view>
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

#sidebarWrapper {
}

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
  padding: 4rem;
  background-color: var(--containerBackground);
}

@media screen and (max-width: 767px) {
  #sidebarDark {
    display: none;
  }

  #sidebar {
    width: 100%;
    padding: 1em;
  }
}
</style>