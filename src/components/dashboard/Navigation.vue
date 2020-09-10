<template>
  <nav id="navigation" class="menu-container">
    <options-button class="navigation__optionsButton"></options-button>
    <sort-button class="navigation__sortButton" />
    <filter-button class="navigation__filterButton" />
    <router-link to="/subscription/new" tag="div" class="add">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#fff" fill-opacity="1" />
      </svg>
    </router-link>
  </nav>
</template>

<script>
import OptionsButton from "./buttons/OptionsButton";
import SortButton from "./buttons/SortButton";
import FilterButton from "./buttons/FilterButton";

export default {
  components: {
    SortButton,
    FilterButton,
    OptionsButton,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
#navigation {
  background-color: var(--mainAccent);
  color: #fff;
  padding: 0.6em 1em;
  display: flex;
  position: relative;
}

.navigation__optionsButton {
  flex-grow: 1;
  text-align: left;
}

.add {
  $size: 48px;

  position: absolute;
  left: 50%;
  margin-left: -1 * ($size / 2);
  top: -1 * ($size / 2);
  border-radius: 50%;
  width: $size;
  height: $size;
  background-color: var(--mainAccent);
  display: grid;
  place-items: center;
  border: 4px solid #fff;
  cursor: pointer;
}
</style>
