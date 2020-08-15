<template>
  <div class="unknownWrapper">
    <h1>404</h1>
    <h2>Looks like you're lost?</h2>
    <p>The page you are looking for is not available!</p>
    <div class="backToSafety__wrapper">
      <router-link to="/dashboard" class="backToSafety">Back to Safety</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.unknownWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 200px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 12px;
  }

  p {
    font-size: 90%;
    margin-bottom: 36px;
  }

.backToSafety__wrapper {
  text-align: center;

  .backToSafety {
    background-color: var(--success);
    border-radius: 32px;
    text-align: center;
    display: inline-block;
    text-transform: uppercase;
    font-weight: bold;
    padding: 12px 28px;
    color: #eef6ed;
    cursor: pointer;
    border: none;
    text-decoration: none;
  }
}
}
</style>
