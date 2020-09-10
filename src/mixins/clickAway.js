export const clickAway = {
  data: function() {},
  methods: {
    // @param   e    Event
    clickAway(e) {
      // Important to put ref="" on menu element parent / container
      // and also data-name="" for the name of the dropdown's visibility state
      
      const target = e.target;

      for (let ref in this.$refs) {
        const el = this.$refs[ref];

        if (el && el !== target && !el.contains(target) || target.dataset.ignoreclickaway) {
          const dataOption = el.dataset.name;

          if (!dataOption) return;

          this[dataOption] = false;
        }
      }
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
