<template>
  <div class="options-menu">
    <ul>
      <li>
        <i class="fa fa-tag"></i> Tags
      </li>
      <li @click="handleConfirmDelete">
        <i class="fa fa-trash"></i> Delete
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: function() {
    return {};
  },
  props: {
    subscriptionId: {
      type: String,
      required: true
    }
  },
  methods: {
    async handleConfirmDelete() {
      if (!confirm("Are you sure? Deleting a subscription is permanent."))
        return;

      try {
        await this.$http.delete(
          `/api/subscription/${this.subscriptionId}`
        );

        this.$emit('fetchSubscriptions');
        this.$router.push('/app/dashboard/');
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.options-menu {
  -moz-user-select: none;
  -webkit-user-select: none;

  z-index: 5;
  position: absolute;
  top: 42px;
  right: -10px;
  padding: 1em 0;
  line-height: 1;
  font-size: 0.8rem;
  border-radius: 12px;
  background-color: #333;

  i {
    padding: 0 12px 0 0;
  }

  li {
    cursor: pointer;
    width: 120px;
    padding: 1em;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>