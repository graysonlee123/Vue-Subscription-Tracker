<template>
  <div class="preferences__wrapper">
    <div class="inputGroup">
      <label for="themeSelect" class="inputGroup__label">
        Theme
        <span
          v-if="theme === 'dark01'"
          class="fieldError"
        >sorry, dark mode isn't supported (yet).</span>
      </label>
      <select name="theme" id="themeSelect" v-model="theme">
        <option value="light01">Light</option>
        <option value="dark01">Dark</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'light01',
    };
  },
};
</script>

<style lang="scss" scoped>
.preferences__wrapper {
  padding: 2em 0;
}
</style>
