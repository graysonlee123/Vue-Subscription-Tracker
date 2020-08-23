<template>
  <div class="button__wrapper">
    <button @click="handleSubmit">
      <slot>Submit</slot>
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.$emit("handle-submit");
    },
  },
};
</script>

<style lang="scss" scoped>
.button__wrapper {
  text-align: center;
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

  &.danger {
    background-color: var(--danger);
  }
}
</style>