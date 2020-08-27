<template>
  <div
    class="inputGroup"
    ref="colorMenu"
    data-name="showColorModal"
    :class="{'inputGroup--error': errors.length}"
  >
    <label for class="inputGroup__label">
      {{label}}
      <span class="inputGroup__label--error" v-if="errors.length">{{ errors[0].msg }}</span>
    </label>
    <div class="inputGroup__input" @click="toggleColorModal">
      {{placeholder}}
      <div v-if="value" class="inputGroup__swatch" :style="{backgroundColor: value}"></div>
    </div>

    <ul class="inputGroup__modal" v-if="showColorModal">
      <li
        v-for="(color, index) in colors"
        :key="index"
        :style="{backgroundColor: color}"
        :class="{selected: value === color}"
        @click="handleChange(color);"
      >
        <i class="fa fa-check"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { clickAway } from "../../../mixins/clickAway";

export default {
  mixins: [clickAway],
  props: {
    value: {
      required: true,
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    errors: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      showColorModal: false,
      colors: [
        // Red
        "#FF3226",
        "#E62C22",
        "#CC271F",
        "#B3221B",

        // Orange
        "#FF8521",
        "#E6781E",
        "#CC6A1B",
        "#B85F18",

        // Yellow
        "#FFAD29",
        "#E69C25",
        "#CC8A21",
        "#B87C1D",

        // Green
        "#49CC56",
        "#40B34C",
        "#379941",
        "#2E8036",

        // Blue
        "#49C1E6",
        "#41ACCC",
        "#3B9AB8",
        "#308098",

        // Indigo
        "#4C65E6",
        "#435ACC",
        "#3D51B8",
        "#334499",

        // Violet
        "#8947E6",
        "#7A3FCC",
        "#6E39B8",
        "#5C3099",

        // Pink
        "#DB4EE6",
        "#C345CC",
        "#B03EB8",
        "#923499",

        // Neutral
        "#222222",
        "#333333",
        "#666666",
        "#999999",

        // Colors generated using
        // https://color.adobe.com/create/color-wheel
      ],
    };
  },
  methods: {
    toggleColorModal(bool) {
      switch (bool) {
        case true: {
          this.showColorModal = true;
          break;
        }
        case false: {
          this.showColorModal = false;
          break;
        }
        default: {
          this.showColorModal
            ? (this.showColorModal = false)
            : (this.showColorModal = true);
          break;
        }
      }
    },
    handleChange(color) {
      this.showColorModal = false;

      this.$emit("handle-change", color);
    },
  },
};
</script>

<style lang="scss" scoped>
.inputGroup {
  position: relative;
  user-select: none;

  .inputGroup__input {
    $height: 42px;

    cursor: pointer;
    padding-top: 0;
    padding-bottom: 0;
    line-height: $height - 4px;
    height: $height;
    border: 2px solid var(--textLight);
    border-radius: $height / 2;
    padding: 0 1.4em;
    font-size: 0.8em;
    color: var(--textDark);
    position: relative;

    .inputGroup__swatch {
      position: absolute;
      width: 24px;
      height: 24px;
      right: 12px;
      top: 8px;
      border-radius: 12px;
    }
  }

  .inputGroup__label--error {
    color: var(--danger);
  }

  .inputGroup__modal {
    position: absolute;
    top: 60px;
    left: 0;
    width: 310px;
    background-color: var(--containerBackground);
    padding: 1em;
    border-radius: 5px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-flow: row wrap;

    li {
      $size: 22px;
      width: $size;
      height: $size;
      border-radius: 50%;
      margin: 6px;
      cursor: pointer;
      transition: 300ms ease-in-out;

      &:hover {
        transform: scale(1.1);
      }

      &.selected {
        transform: scale(1.2);

        i {
          display: grid;
        }
      }

      i {
        display: none;
        height: 100%;
        place-items: center;
        font-size: 0.6em;
        color: #fff;
      }
    }
  }
}

.inputGroup.inputGroup--error {
  .inputGroup__input {
    border-color: var(--danger);
  }
}
</style>
