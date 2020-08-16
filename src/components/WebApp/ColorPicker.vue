<template>
  <div class="colorPicker__wrapper" ref="colorMenu" data-name="showColorModal">
    <div class="colorPicker" @click="toggleColorModal()">
      Pick a Color
      <div
        v-if="selectedColor"
        class="colorPicker__swatch"
        :style="{backgroundColor: selectedColor}"
      ></div>
    </div>
    <div class="colorPicker__modal" :class="{active: showColorModal}">
      <ul>
        <li
          v-for="(color, index) in colors"
          :key="index"
          :style="{backgroundColor: color}"
          :class="{selected: selectedColor === color}"
          @click="pickColor(color);"
        >
          <i class="fa fa-check"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { clickAway } from "../../mixins/clickAway";

export default {
  mixins: [clickAway],
  props: {
    colorProp: {
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
      selectedColor: null,
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
    pickColor(color) {
      this.selectedColor = color;
      this.$emit("pickedAColor", color);
    },
  },
  created() {
    if (this.colorProp) {
      this.pickColor(this.colorProp);
    }
  },
};
</script>

<style lang="scss" scoped>
.colorPicker__wrapper {
  position: relative;
  user-select: none;

  .colorPicker {
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

    .colorPicker__swatch {
      position: absolute;
      width: 24px;
      height: 24px;
      right: 12px;
      top: 8px;
      border-radius: 12px;
    }
  }

  .colorPicker__modal {
    position: absolute;
    top: 60px;
    left: 0;
    width: 310px;
    background-color: var(--containerBackground);
    padding: 1em;
    border-radius: 5px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    display: none;

    &.active {
      display: block;
    }

    ul {
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
}
</style>
