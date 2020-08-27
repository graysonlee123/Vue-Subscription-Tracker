export const formErrors = {
  data: function() {
    formErrors: [];
  },
  methods: {
    // @param   err           Error Object    Takes in error object from express validator
    // @param   elementId     String          Optional input element's ID to focus on error
    addFormError(err, elementId) {
      if (err && err.response && err.response.data) {
        if (elementId) {
          const element = document.getElementById(elementId);

          element && element.focus();
        }

        err.response.data.errors.forEach(({ param: field, msg }) =>
          this.formErrors.push({ field, msg })
        );
      }
    },
    // @param     field     string      The field name of the error(s) to be removed
    removeFormError(field) {
      if (this.formErrors.length) {
        this.formErrors = this.formErrors.filter((error, index) => {
          return error.field !== field;
        });
      }
    },
    clearErrors() {
      this.formErrors = [];
    }
  }
};
