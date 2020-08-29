<template>
  <div class="button__wrapper" :style="{textAlign: align}">
    <button @click="handleSubmit" :class="{ [className]: true }">
      <slot>Submit</slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "success",
    },
    align: {
      type: String,
      default: "center",
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.$emit("handle-submit");
    },
  },
  computed: {
    className() {
      switch (this.color) {
        case 'danger':
          return 'button--danger';
        case 'success':
        default:
          return 'button--success';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button__wrapper {
}

button {
  background-color: var(--success);
  border-radius: 32px;
  text-align: center;
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  padding: 12px 28px;
  color: #eef6ed;
  cursor: pointer;
  border: none;

  &:focus {
    outline: none;
  }

  &.button--danger {
    background-color: var(--danger);
  }
}
</style>