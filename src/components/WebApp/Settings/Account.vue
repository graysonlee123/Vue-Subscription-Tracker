<template>
  <div>
    <settings-header>Account</settings-header>
    <header>
      <div class="img-container">
        <!-- Using a label to click on the hidden file upload field -->
        <label for="avatar">
          <img :src="avatarUrl" alt="Avatar" class="avatar" />
          <div v-if="avatarIsUploading" class="spinnerWrapper">
            <div class="spinnerWrapper__spinner"></div>
          </div>
        </label>
        <input
          id="avatar"
          type="file"
          name="avatar"
          @change="attemptAvatarUpload"
          style="display: none"
        />
      </div>
      <div class="header-text">
        <h2>{{computeFullName}}</h2>
        <p>{{computeEmail}}</p>
      </div>
    </header>
    <div class="divider"></div>
    <form>
      <div class="col2">
        <text-input
          v-model="first_name"
          label="First Name"
          :errors="formErrors.filter(error => error.field === 'first_name')"
        ></text-input>
        <text-input
          v-model="last_name"
          label="Last Name"
          :errors="formErrors.filter(error => error.field === 'last_name')"
        ></text-input>
      </div>
      <text-input
        v-model="email"
        label="Email"
        :errors="formErrors.filter(error => error.field === 'email')"
      ></text-input>
      <submit-button @handle-submit="handleSubmit"></submit-button>
    </form>
  </div>
</template>

<script>
import { storage } from "../../../firebase";

import { formErrors } from "../../../mixins/formErrors";
import { modal } from "../../../mixins/modal";

import TextInput from "../General/TextInput";
import SubmitButton from "../General/SubmitButton";
import SettingsHeader from "./SettingsHeader";

export default {
  data() {
    return {
      formErrors: [],
      last_name: "",
      first_name: "",
      email: "",
      showAvatarInput: false,
      avatarFile: null,
      avatarIsUploading: false,
    };
  },
  components: {
    textInput: TextInput,
    submitButton: SubmitButton,
    settingsHeader: SettingsHeader,
  },
  mixins: [formErrors, modal],
  methods: {
    async handleSubmit() {
      this.formErrors = [];

      // TODO: Make more DRY
      const data = {};

      if (this.email !== this.computeEmail) {
        data.email = this.email;
      }

      if (this.first_name !== this.computeFirstName) {
        data.first_name = this.first_name;
      }

      if (this.last_name !== this.computeLastName) {
        data.last_name = this.last_name;
      }

      if (Object.keys(data).length > 0) {
        try {
          const user = await this.$http.patch("/api/user", data);

          this.$store
            .dispatch("refreshUser")
            .then(() => {
              this.modal("Your accout was succesfully updated.", "success");
            })
            .catch((err) => {
              this.modal(
                "There was a problem with that request. Please try again later.",
                "danger"
              );
            });
        } catch (err) {
          this.addFormError(err);
          console.log(err);
        }
      }
    },
    async attemptAvatarUpload(e) {
      const file = e.target.files[0];
      this.avatarFile = e.target.files[0];

      const fileExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (!fileExtensions.exec(file.name)) {
        this.modal(
          "File type not supported for avatars! Use .jpg or .png.",
          "danger"
        );

        document.getElementById("avatar").value = "";

        return;
      }

      // 1 MB = 1000000
      if (file.size > 1000000 * 10) {
        this.modal("Please upload an image that is less than 10MB.", "danger");

        document.getElementById("avatar").value = "";

        return;
      }

      this.avatarIsUploading = true;
      const uploadTask = storage.ref(`/avatars/${file.name}`).put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // console.log(snapshot);
        },
        (err) => {
          this.modal(
            "There was an error uploading that avatar. Try a different file or try again later.",
            "danger"
          );
          console.log(err);
          this.avatarIsUploading = false;
        },
        async () => {
          try {
            const downloadUrl = await storage
              .ref("avatars")
              .child(file.name)
              .getDownloadURL();

            const payload = {
              avatar: downloadUrl,
            };

            await this.$http.patch("/api/user", payload);

            this.$store.dispatch("refreshUser");
            this.modal("Your avatar was succesfully updated.", "success");
            this.avatarIsUploading = false;
          } catch (error) {
            this.modal(
              "There was an error uploading that avatar. Try a different file or try again later.",
              "danger",
              5000
            );
            this.avatarIsUploading = false;
          }
        }
      );
    },
  },
  computed: {
    computeFirstName() {
      return this.$store.state.user.first_name;
    },
    computeLastName() {
      return this.$store.state.user.last_name;
    },
    computeFullName() {
      return `${this.computeFirstName} ${this.computeLastName}`;
    },
    computeEmail() {
      return this.$store.state.user.email;
    },
    avatarUrl() {
      return this.$store.state.user.avatar;
    },
  },
  created() {
    if (this.computeEmail) {
      this.email = this.computeEmail;
    }

    if (this.computeFirstName) {
      this.first_name = this.computeFirstName;
    }

    if (this.computeLastName) {
      this.last_name = this.computeLastName;
    }
  },
};
</script>

<style lang="scss" scoped>
$navBreak: 991px;

header {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  .img-container {
    $size: 6em;
    width: $size;
    height: $size;
    border-radius: $size / 2;
    overflow: hidden;
    flex-shrink: 0;
    margin-bottom: 2em;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;

      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }

    .spinnerWrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .spinnerWrapper__spinner {
        $size: 32px;
        width: $size;
        height: $size;
        border: 3px solid var(--mainAccent);
        border-bottom-color: transparent;
        border-radius: $size / 2;

        animation: 1s ease-in-out infinite running spin;
      }
    }
  }

  .header-text {
    h2 {
      font-size: 2em;
      text-transform: capitalize;
      color: var(--textDark);
    }

    p {
      margin-top: 0.6em;
    }
  }
}

.divider {
  margin: 2.5em -2em;
  border-top: 3px solid var(--bodyBackground);
}

@media screen and (max-width: 767px) {
  .divider {
    margin: 2.5em 0em;
    border-top: 3px solid var(--bodyBackground);
  }
}

@media screen and (min-width: 767px) {
  header {
    flex-flow: row nowrap;

    .img-container {
      margin-bottom: 0;
    }

    .header-text {
      margin-left: 2em;
      text-align: left;
    }
  }

  .col2 {
    display: flex;

    .inputGroup {
      width: 50%;

      &:first-of-type {
        margin-right: 2em;
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
