<template>
  <div class="password_wrapper">
    <form @submit.prevent="handleUpdatePassword()">
      <div
        class="inputGroup"
        :class="{hasError: formErrors.find(({field}) => field === 'currentPassword')}"
      >
        <label for="currentPassword" class="inputGroup__label">
          Current password
          <span
            class="fieldError"
            v-if="formErrors.find(({field}) => field === 'currentPassword')"
          >{{formErrors.find(({field}) => field ==='currentPassword').msg}}</span>
        </label>
        <input type="password" name="password" id="currentPassword" v-model="currentPassword" />
      </div>
      <div
        class="inputGroup"
        :class="{hasError: formErrors.find(({field}) => field === 'newPassword')}"
      >
        <label for="newPassword" class="inputGroup__label">
          New password
          <span
            class="fieldError"
            v-if="formErrors.find(({field}) => field === 'newPassword')"
          >{{formErrors.find(({field}) => field ==='newPassword').msg}}</span>
        </label>
        <input type="password" name="newPassword" id="newPassword" v-model="newPassword" />
      </div>
      <div class="inputGroup">
        <label for="confirmPassword" class="inputGroup__label">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          v-model="confirmPassword"
        />
      </div>
      <div class="submit__wrapper">
        <input type="submit" value="Update" class="roundedButton" />
      </div>
    </form>
  </div>
</template>

<script>
import { formErrors } from "../../../mixins/formErrors";

export default {
  data: function () {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      formErrors: [],
    };
  },
  mixins: [formErrors],
  methods: {
    handleUpdatePassword: async function () {
      this.formErrors = [];

      if (!this.newPassword.length) {
        this.formErrors.push({
          field: "newPassword",
          msg: "must provide a new password",
        });

        return;
      } else if (this.newPassword.trim() !== this.confirmPassword.trim()) {
        this.newPassword = "";
        this.confirmPassword = "";

        this.formErrors.push({
          field: "newPassword",
          msg: "passwords must match",
        });

        return;
      }

      try {
        const update = await this.$http.post(`/api/user/password`, {
          currentPassword: this.currentPassword,
          newPassword: this.confirmPassword,
        });

        alert('Password change successful');
      } catch (err) {
        console.log(err);
        this.addFormError(err, "newPassword");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.password_wrapper {
  padding: 2em 0;
}

.inputGroup {
  margin-bottom: 1.6em;
  max-width: 276px;
}

.submit__wrapper {
  text-align: left;
}
</style>