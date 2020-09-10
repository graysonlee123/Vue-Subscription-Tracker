<template>
  <div class="spinner">
    <div class="spinner__circle"></div>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  .spinner__circle {
    animation: spin 1s infinite;
    width: 32px;
    height: 32px;
    border: 3px solid var(--mainAccent);
    border-bottom-color: transparent;
    border-radius: 16px;
  }
}

@keyframes spin {
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>