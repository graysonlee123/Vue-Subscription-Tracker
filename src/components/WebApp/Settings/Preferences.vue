<template>
  <div>
    <settings-header>Preferences</settings-header>
    <form>
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
      <submit-button @handle-submit="handleSubmit"></submit-button>
    </form>
  </div>
</template>

<script>
import SubmitButton from "../General/SubmitButton";
import SettingsHeader from "./SettingsHeader";

export default {
  components: {
    submitButton: SubmitButton,
    settingsHeader: SettingsHeader
  },
  data() {
    return {
      theme: "light01",
    };
  },
  methods: {
    handleSubmit() {
      console.log("WIP");
    }
  }
};
</script>

<style lang="scss" scoped>
.inputGroup {
  margin-bottom: 2em;
}
</style>
