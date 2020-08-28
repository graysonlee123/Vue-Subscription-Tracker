export const clickAway = {
  data: function() {},
  methods: {
    // @param   e    Event
    clickAway(e) {
      // Important to put ref="" on menu element parent / container
      // and also data-name="" for the name of the dropdown's visibility state
      
      const target = e.target;
      
      Object.keys(this.$refs).forEach(menu => {
        const el = this.$refs[menu];

        if (el !== target && !el.contains(target)) {
          if (el.dataset.name) {
            this[el.dataset.name] = false;
          }
        }
      });
    }
  },
  created() {
    document.addEventListener("click", this.clickAway);
    document.addEventListener("touchstart", this.clickAway);
  },
  destroyed() {
    document.removeEventListener("click", this.clickAway);
    document.removeEventListener("touchstart", this.clickAway);
  }
};
