<template>
  <button class="filterButton" @click="visible = true" ref="sortMenu" data-name="visible">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.75 7H6.25V17H8.75L5.25 20.5L1.75 17H4.25V7H1.75L5.25 3.5L8.75 7ZM10.25 7V5H22.25V7H10.25ZM10.25 19H22.25V17H10.25V19ZM22.25 13H10.25V11H22.25V13Z"
        :fill="iconColor"
        :fill-opacity="iconOpacity"
      />
    </svg>

    <div v-if="visible" class="filterButton__fullscreenDarken" data-ignoreclickaway="true"></div>
    <ul class="filterButton__menu" v-if="visible">
      <li class="filterButton__option filterButton__option--header">
        Filter by
      </li>
      <!-- <li class="filterButton__option">
        <label>Name</label>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="filterButton__arrow"
          :class="{'filterButton__arrow--selected': $store.getters.sortingBy === 'name' && $store.getters.sortingDirection === -1}"
          @click="changeSort({sortBy: 'name', sortDirection: -1})"
        >
          <path
            d="M7.41 8.29501L12 12.875L16.59 8.29501L18 9.70501L12 15.705L6 9.70501L7.41 8.29501Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="filterButton__arrow"
          :class="{'filterButton__arrow--selected': $store.getters.sortingBy === 'name' && $store.getters.sortingDirection === 1}"
          @click="changeSort({sortBy: 'name', sortDirection: 1})"
        >
          <path
            d="M7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29501L6 14.295L7.41 15.705Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
      </li> -->
    </ul>
  </button>
</template>

<script>
import { clickAway } from "../../../mixins/clickAway";

export default {
  mixins: [clickAway],
  props: {
    iconColor: {
      type: String,
      default: "#fff",
    },
    iconOpacity: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    changeSort(payload) {
      this.$store.dispatch("changeFilter", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
.filterButton {
  background: none;
  border: none;
  margin: 0;
  padding: 6px;
  cursor: pointer;

  .filterButton__icon {
    width: 24px;
    height: 24px;
  }
}

.filterButton__fullscreenDarken {
  z-index: 1010;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.filterButton__menu {
  z-index: 1020;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--containerBackground);
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-shadow: 0 8px 4px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  text-align: left;

  .filterButton__option {
    padding: 0.6rem 1.6rem;
    line-height: 16px;
    display: flex;
    align-items: center;

    &.filterButton__option--header {
      font-size: 1.2em;
      font-weight: bold;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    label {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .filterButton__arrow {
      width: 32px;
      height: 32px;
      padding: 3px;
      border-radius: 50%;
      border: 2px solid transparent;
    }

    .filterButton__arrow--selected {
      border-color: var(--mainAccent);
    }
  }
}
</style>