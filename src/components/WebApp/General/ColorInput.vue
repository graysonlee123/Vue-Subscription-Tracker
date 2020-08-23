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
        "#00aa55",
        "#008040",
        "#1e90ff",
        "#0f4880",
        "#00a4a6",
        "#e26a6a",
        "#bf6ee0",
        "#77448b",
        "#b8860b",
        "#e65722",
        "#e63022",
        "#e76e3c",
        "#f64747",
        "#939393",
        "#2e343b",
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
