<template>
  <button class="sortButton" @click="visible = true" ref="sortMenu" data-name="visible">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 6V8H21V6H3ZM10 18H14V16H10V18ZM18 13H6V11H18V13Z"
        :fill="iconColor"
        :fill-opacity="iconOpacity"
        class="sortButton__icon"
      />
    </svg>
    <div v-if="visible" class="sortButton__fullscreenDarken" data-ignoreclickaway="true"></div>
    <ul class="sortButton__menu" v-if="visible">
      <li class="sortButton__option sortButton__option--header">
        Sort by
      </li>
      <li class="sortButton__option">
        <label>Name</label>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'name' && sortingDirection === -1}"
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
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'name' && sortingDirection === 1}"
          @click="changeSort({sortBy: 'name', sortDirection: 1})"
        >
          <path
            d="M7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29501L6 14.295L7.41 15.705Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
      </li>
      <li class="sortButton__option">
        <label>Price</label>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'price' && sortingDirection === -1}"
          @click="changeSort({sortBy: 'price', sortDirection: -1})"
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
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'price' && sortingDirection === 1}"
          @click="changeSort({sortBy: 'price', sortDirection: 1})"
        >
          <path
            d="M7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29501L6 14.295L7.41 15.705Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
      </li>
      <li class="sortButton__option">
        <label>Next billing date</label>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'nextPayment' && sortingDirection === -1}"
          @click="changeSort({sortBy: 'nextPayment', sortDirection: -1})"
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
          class="sortButton__arrow"
          :class="{'sortButton__arrow--selected': sortingBy === 'nextPayment' && sortingDirection === 1}"
          @click="changeSort({sortBy: 'nextPayment', sortDirection: 1})"
        >
          <path
            d="M7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29501L6 14.295L7.41 15.705Z"
            fill="black"
            fill-opacity="0.54"
          />
        </svg>
      </li>
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
      default: "#fff"
    },
    iconOpacity: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    changeSort(payload) {
      this.$store.dispatch("changeSort", payload);
    },
  },
  computed: {
    sortingBy() {
      return this.$store.getters.sortingBy;
    },
    sortingDirection() {
      return this.$store.getters.sortingDirection;
    }
  }
};
</script>

<style lang="scss" scoped>
.sortButton {
  background: none;
  border: none;
  margin: 0;
  padding: 6px;
  cursor: pointer;

  .sortButton__icon {
    width: 24px;
    height: 24px;
  }
}

.sortButton__fullscreenDarken {
  z-index: 1010;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.sortButton__menu {
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

  .sortButton__option {
    padding: 0.6rem 1.6rem;
    line-height: 16px;
    display: flex;
    align-items: center;

    &.sortButton__option--header {
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

    .sortButton__arrow {
      width: 32px;
      height: 32px;
      padding: 3px;
      border-radius: 50%;
      border: 2px solid transparent;
    }

    .sortButton__arrow--selected {
      border-color: var(--mainAccent);
    }
  }
}
</style>