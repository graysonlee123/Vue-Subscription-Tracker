<template>
  <div class="inputGroup" :class="{'inputGroup--error': errors.length}">
    <label for class="inputGroup__label">
      {{label}}
      <span class="inputGroup__label--error" v-if="errors.length">{{ errors[0].msg }}</span>
    </label>
    <select class="inputGroup__input" :name="label" id :value="value" @input="$emit('input', $event.target.value)">
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option"
      >{{option.charAt(0).toUpperCase() + option.slice(1)}}{{plural ? 's' : ''}}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    errors: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    plural: {
      type: Boolean
    }
  },
  data() {
    return {
      interval: 1,
    };
  },
  methods: {
    handleChange(e) {
      this.$emit("handle-change", e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.inputGroup {
  margin-bottom: 1.6rem;

  .inputGroup__label {
    display: block;
    margin-bottom: 0.8em;
    color: var(--textLight);
    font-size: 0.8em;
    font-weight: bold;
    padding-left: 1.6em;

    .inputGroup__label--error {
      color: var(--danger);
    }
  }

  .inputGroup__input {
    width: 100%;
    border: 2px solid var(--textLight);
    font-size: 0.8em;
    background-color: transparent;
    color: var(--textDark);
    border-radius: 21px;
    height: 42px;
    line-height: 36px;
    padding: 0 1.6em;

    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;

    // Using the prefix '~' enforces Webpack to treat it as a module request,
    // similar to require in JS
    background-image: url('~@/assets/sort-arrow-reversed.svg');
    background-repeat: no-repeat;
    background-position: right 16px top 50%;
    background-size: 10px auto;

    &::-ms-expand {
      display: none;
    }

    &:focus {
      outline: none;
    }

    option {
      font-weight: normal;
    }
  }
}

.inputGroup.inputGroup--error {
  .inputGroup__input {
    border-color: var(--danger);
  }
}
</style>