<template>
  <div class="no-subscription-container">
    <i class="fas fa-question-circle"></i>
    <p>Select a subscription to view its details, or add a new one.</p>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss">
.no-subscription-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;

  i {
    font-size: 64px;
    margin-bottom: 2rem;
    color: #fcfcfc;
  }
}
</style>