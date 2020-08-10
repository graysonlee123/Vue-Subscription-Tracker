<template>
  <div class="advanced__wrapper">
    <input type="button" value="Delete Account" class="roundedButton danger" @click="deleteAccount()"/>
  </div>
</template>

<script>
export default {
  data: function () {
    return {};
  },
  methods: {
    deleteAccount: function () {
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone. All data associated with the account will be erased."
        )
      ) {
        console.log('Delete Account');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.advanced__wrapper {
  padding: 2em 0;
}
</style>