<template>
  <div class="inputGroup" :class="{'inputGroup--error': errors.length}">
    <label for class="inputGroup__label">
      {{label}}
      <span class="inputGroup__label--error" v-if="errors.length">{{ errors[0].msg }}</span>
    </label>
    <input
      class="inputGroup__input"
      :placeholder="placeholder"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
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
    placeholder: {
      type: String,
    },
    step: {
      type: String,
    },
    min: {
      type: String,
    },
    max: {
      type: String,
    },
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
    line-height: 42px;
    padding: 0 1.4em;

    &::-webkit-input-placeholder {
      color: var(--textLight);
    }

    &::-moz-placeholder {
      opacity: 1;
      color: var(--textLight);
    }

    &:-ms-input-placeholder {
      color: var(--textLight);
    }

    &:-moz-placeholder {
      opacity: 1;
      color: var(--textLight);
    }

    // Hide arrows / spinners
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    -moz-appearance: textfield;
  }
}

.inputGroup.inputGroup--error {
  .inputGroup__input {
    border-color: var(--danger);
  }
}

@media screen and (max-width: 464px) {
  .col2 {
    .inputGroup {
      .inputGroup__label {
        .inputGroup__label--error {
          display: block;
        }
      }
    }
  }
}
</style>