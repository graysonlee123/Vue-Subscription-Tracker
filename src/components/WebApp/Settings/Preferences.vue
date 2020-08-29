<template>
  <div>
    <settings-header>Preferences</settings-header>
    <form>
      <select-input
        v-model="theme"
        label="Theme"
        :errors="theme === 'dark' ? [{msg: 'is not supported (yet)'}] : []"
        :options="['light', 'dark']"
      ></select-input>
      <submit-button @handle-submit="handleSubmit"></submit-button>
    </form>
  </div>
</template>

<script>
import SubmitButton from "../General/SubmitButton";
import SettingsHeader from "./SettingsHeader";
import SelectInput from "../General/SelectInput";

export default {
  components: {
    submitButton: SubmitButton,
    settingsHeader: SettingsHeader,
    SelectInput,
  },
  data() {
    return {
      theme: "light",
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
