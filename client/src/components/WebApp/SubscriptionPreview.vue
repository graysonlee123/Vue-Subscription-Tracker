<template>
  <router-link
    :to="`/app/dashboard/subscription/view/${subscription._id}`"
    tag="li"
    :style="{borderLeftColor: subscription.color}"
    class="subscription-preview"
  >
    <div class="info">
      <header>{{subscription.name}}</header>
      <small v-if="subscription.description">{{subscription.description}}</small>
    </div>
    <div class="pricing">
      <header>${{subscription.price}}</header>
      <small>$48.00 / y</small>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    subscription: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 62px;

li.subscription-preview {
  height: $height;
  background-color: #333;
  border-left: 4px solid #333;
  box-shadow: 0 4px 16px rgba($color: black, $alpha: 0.4);
  margin-bottom: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover,
  &.router-link-active {
    background-color: #444;
  }

  .info {
    margin-left: 16px;
    flex: 1 1 200px;
    overflow: hidden;
    width: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;

    header {
      display: inline;
    }

    small {
      color: rgba($color: white, $alpha: 0.5);
      font-size: 0.8em;
    }
  }

  .pricing {
    margin-left: 1em;
    margin-right: 1em;
    flex: 0 0 100px;
    text-align: center;

    header {
      font-weight: bold;
      font-size: 1.1em;
      margin-bottom: 4px;
    }

    small {
      font-weight: lighter;
      font-size: 0.7em;
      color: rgba($color: white, $alpha: 0.5);
    }
  }
}
</style>