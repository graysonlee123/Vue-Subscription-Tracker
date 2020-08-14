<template>
  <select id="select-language" v-model="selectedLanguage" v-on:change="handleLangChange">
    <option value="en">English</option>
    <option value="sp">Spanish</option>
    <option value="da">Danish</option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      selectedLanguage: '',
    };
  },
  methods: {
    handleLangChange() {
      this.$store.dispatch('languageChange', this.selectedLanguage);
    },
  },
  created() {
    this.selectedLanguage = this.$store.state.preferences.language;
  },
};
</script>
