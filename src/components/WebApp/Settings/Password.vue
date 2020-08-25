<template>
  <div>
    <form>
      <!-- <div
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
        <input
          type="password"
          name="password"
          id="currentPassword"
          v-model="currentPassword"
          v-on:blur="removeFormError('currentPassword')"
        />
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
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          v-model="newPassword"
          v-on:blur="removeFormError('newPassword')"
        />
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
      </div>-->
      <settings-header>Password</settings-header>
      <text-input
        v-model="currentPassword"
        type="password"
        label="Current password"
        :errors="formErrors.filter(error => error.field === 'currentPassword')"
      ></text-input>
      <text-input
        v-model="newPassword"
        type="password"
        label="New password"
        :errors="formErrors.filter(error => error.field === 'newPassword')"
      ></text-input>
      <text-input
        v-model="confirmPassword"
        type="password"
        label="Confirm new password"
        :errors="formErrors.filter(error => error.field === 'confirmPassword')"
      ></text-input>
      <submit-button @handle-submit="handleUpdatePassword">Save Password</submit-button>
    </form>
  </div>
</template>

<script>
import { formErrors } from "../../../mixins/formErrors";
import { modal } from "../../../mixins/modal";

import TextInput from "../General/TextInput";
import SubmitButton from "../General/SubmitButton";
import SettingsHeader from "./SettingsHeader";

export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      formErrors: [],
    };
  },
  components: {
    textInput: TextInput,
    submitButton: SubmitButton,
    settingsHeader: SettingsHeader,
  },
  mixins: [formErrors, modal],
  methods: {
    async handleUpdatePassword() {
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
        const update = await this.$http.post("/api/user/password", {
          currentPassword: this.currentPassword,
          newPassword: this.confirmPassword,
        });

        this.modal("Password was succesfully changed.", "success");

        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (err) {
        console.log(err);
        this.addFormError(err, "newPassword");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
