<template>
  <div class="inputGroup" :class="{'inputGroup--error': errors.length}">
    <label :for="'textInput__' + label.toLowerCase()" class="inputGroup__label">
      {{label}}
      <span class="inputGroup__label--error" v-if="errors.length">{{ errors[0].msg }}</span>
    </label>
    <textarea
      :id="'textInput__' + label.toLowerCase()"
      class="inputGroup__input"
      rows="8"
      cols="12"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    ></textarea>
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
    // Font fix for Firefox
    font-family: Arial, Helvetica, sans-serif;
    // Restrain size
    width: 100%;
    height: 120px;
    resize: none;
    border: 2px solid var(--textLight);
    font-size: 0.8em;
    background-color: transparent;
    color: var(--textDark);
    border-radius: 21px;
    line-height: 1.6;
    padding: 1em 1.4em;

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