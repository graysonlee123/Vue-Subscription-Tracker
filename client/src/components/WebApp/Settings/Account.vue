<template>
  <div class="account__wrapper">
    <header>
      <div class="img-container">
        <picture-input
          ref="pictureInput"
          @change="attemptUpload"
          :width="96"
          :height="96"
          :removable="false"
          accept="image/jpeg, image/png, image/gif"
          buttonClass="roundedButton"
          removeButtonClass="roundedButton"
          :hideChangeButton="true"
          radius="48"
          :prefill="avatarUrl"
          :customStrings="{
            drag: 'Drag or Click'
          }"
        ></picture-input>
      </div>
      <div class="header-text">
        <h2>{{computeFullName}}</h2>
        <p>{{computeEmail}}</p>
      </div>
    </header>
    <div class="divider"></div>
    <form @submit.prevent="handleSubmit">
      <div class="inputGroup" :class="{hasError: formErrors.find(({field}) => field === 'email')}">
        <label for="email" class="inputGroup__label">
          Email
          <span
            class="fieldError"
            v-if="formErrors.find(({field}) => field === 'email')"
          >{{formErrors.find(({field}) => field ==='email').msg}}</span>
        </label>
        <input type="text" v-model="email" />
      </div>
      <div class="col2">
        <div
          class="inputGroup"
          :class="{hasError: formErrors.find(({field}) => field === 'first_name')}"
        >
          <label for="first_name" class="inputGroup__label">
            First name
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'first_name')"
            >{{formErrors.find(({field}) => field ==='first_name').msg}}</span>
          </label>
          <input type="text" v-model="first_name" />
        </div>
        <div
          class="inputGroup"
          :class="{hasError: formErrors.find(({field}) => field === 'last_name')}"
        >
          <label for="last_name" class="inputGroup__label">
            Last name
            <span
              class="fieldError"
              v-if="formErrors.find(({field}) => field === 'last_name')"
            >{{formErrors.find(({field}) => field ==='last_name').msg}}</span>
          </label>
          <input type="text" v-model="last_name" />
        </div>
      </div>
      <div class="submitWrapper">
        <input type="submit" class="roundedButton" value="Submit" />
      </div>
    </form>
  </div>
</template>

<script>
import { formErrors } from "../../../mixins/formErrors";
import { v4 as uuidv4 } from "uuid";
import PictureInput from "vue-picture-input";

export default {
  data: function () {
    return {
      formErrors: [],
      last_name: "",
      first_name: "",
      email: "",
    };
  },
  components: {
    PictureInput,
  },
  mixins: [formErrors],
  methods: {
    handleSubmit: async function (name) {
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
          const user = await this.$http.patch(`/api/user`, data);

          this.$store
            .dispatch("refreshUser")
            .then(() => {
              this.$store.dispatch("addModal", {
                type: "success",
                message: "Your accout was succesfully updated.",
                uuid: uuidv4(),
              });
            })
            .catch((err) => {
              this.$store.dispatch("addModal", {
                type: "danger",
                message:
                  "There was a problem with that request. Please try again later.",
                uuid: uuidv4(),
              });
            });
        } catch (err) {
          this.addFormError(err);
          console.log(err);
        }
      }
    },
    attemptUpload: async function () {
      if (this.$refs.pictureInput.file) {
        this.image = this.$refs.pictureInput.file;

        if (this.image) {
          const formData = new FormData();

          formData.append("avatar", this.image);
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };

          try {
            const response = await this.$http.post(
              "/api/user/avatar",
              formData,
              config
            );

            if (response.data) {
              this.image = "";
              this.$store.dispatch("refreshUser");
              this.$store.dispatch("addModal", {
                type: "success",
                message: "Your avatar was succesfully updated.",
                uuid: uuidv4(),
              });
            }
          } catch (err) {
            console.error(err);

            this.$store.dispatch("addModal", {
              type: "danger",
              message:
                "There was an error uploading that image. Please try a different image.",
              uuid: uuidv4(),
            });
          }
        }
      } else {
        console.error("Older browser. No support for Filereader API");
      }
    },
  },
  computed: {
    computeFirstName: function () {
      return this.$store.state.user.first_name;
    },
    computeLastName: function () {
      return this.$store.state.user.last_name;
    },
    computeFullName: function () {
      return `${this.computeFirstName} ${this.computeLastName}`;
    },
    computeEmail: function () {
      return this.$store.state.user.email;
    },
    avatarUrl: function () {
      return this.$store.getters.avatarUrl;
    },
  },
  created: function () {
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

.account__wrapper {
  padding: 2em 0;
}

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

    &:hover {
      cursor: pointer;
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

.inputGroup {
  margin-bottom: 2em;
}

@media screen and (min-width: $navBreak) {
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
</style>