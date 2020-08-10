<template>
  <div class="preferences__wrapper">
    <div class="inputGroup">
      <label for="themeSelect" class="inputGroup__label">Theme</label>
      <select name="theme" id="themeSelect">
        <option value="light01">Light</option>
        <option value="dark01">Dark</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.preferences__wrapper {
  padding: 2em 0;
}
</style>