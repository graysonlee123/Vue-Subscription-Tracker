<template>
  <div class="formHeader">
    <div class="formHeader__text">
      <h2>
        <slot></slot>
      </h2>
      <a @click="$router.push('/dashboard')">
        <img src="@/assets/close.svg" alt="Close" />
      </a>
    </div>
    <div class="divider"></div>
  </div>
</template>

<style lang="scss" scoped>
.formHeader {
  margin-bottom: 2em;
}

.formHeader__text {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider {
  margin-top: 1em;
  margin-bottom: 1em;
  height: 3px;
  background-color: var(--bodyBackground);
}

h2 {
  font-size: 32px;
  color: #8369fe;
}

a {
  cursor: pointer;
}
</style>