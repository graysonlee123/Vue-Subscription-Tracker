<template>
  <select id="select-language" v-model="selectedLanguage" v-on:change="handleLangChange">
    <option value="en">English</option>
    <option value="sp">Spanish</option>
    <option value="da">Danish</option>
  </select>
</template>

<script>
export default {
  data: function() {
    return {
      selectedLanguage: ''
    }
  },
  methods: {
    handleLangChange: function() {
      this.$store.dispatch('languageChange', this.selectedLanguage);
    }
  },
  created() {
    this.selectedLanguage = this.$store.state.preferences.language;
  }
}
</script>