export const formErrors = {
  methods: {
    // @param   err           Error Object    Takes in error object from express validator
    // @param   elementId     String          Optional input element's ID to focus on error
    addFormError: function(err, elementId) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(({ param: field, msg }) =>
          this.formErrors.push({ field, msg })
        );

        if (elementId) {
          document.getElementById(elementId).focus();
        }
      }
    },
    // @param     field     string      The field name of the error to be removed
    removeFormError: function(field) {
      this.formErrors.find((error, index) => {
        if (error && error.field === field) {
          this.formErrors.splice(index, 1);
        }
      });
    },
    clearErrors: function() {
      this.formErrors = [];
    }
  }
};
