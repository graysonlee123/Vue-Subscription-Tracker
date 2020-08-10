<template>
  <div>
    <header>
      <div class="img-container">
        <img src="http://via.placeholder.com/200" alt="Avatar" />
      </div>
      <div class="header-text">
        <h2>{{computeFullName}}</h2>
        <p>
          3 Subscriptions
          <span class="text-divider">|</span> 44 something
          <span class="text-divider">|</span> 23 Something else
        </p>
        <p>Some sort of interesting fact here.</p>
      </div>
    </header>
    <hr class="divider" />
    <div class="input-group">
      <label>Email</label>
      <p v-if="email.showForm">
        <input type="text" v-model="email.value" />
        <input @click="handleSubmit('email')" type="button" value="Submit" />
        <input @click="handleClose('email')" type="button" value="Cancel" />
      </p>
      <p v-else>
        {{computeEmail}}
        <a @click="handleLoadForm('email')">Change Email</a>
      </p>
    </div>
    <div class="input-group">
      <label>Password</label>
      <p>
        ••••••••••
        <a>Change Password</a>
      </p>
    </div>
    <div class="col2">
      <div class="input-group">
        <label>First Name</label>
        <p v-if="firstName.showForm">
          <input type="text" v-model="firstName.value" />
          <input @click="handleSubmit('firstName')" type="button" value="Submit" />
          <input @click="handleClose('firstName')" type="button" value="Cancel" />
        </p>
        <p v-else>
          {{computeFirstName}}
          <a @click="handleLoadForm('firstName')">Update</a>
        </p>
      </div>
      <div class="input-group">
        <label>Last Name</label>
        <p v-if="lastName.showForm">
          <input type="text" v-model="lastName.value" />
          <input @click="handleSubmit('lastName')" type="button" value="Submit" />
          <input @click="handleClose('lastName')" type="button" value="Cancel" />
        </p>
        <p v-else>
          {{computeLastName}}
          <a @click="handleLoadForm('lastName')">Update</a>
        </p>
      </div>
    </div>
    <hr class="divider" />
    <div class="input-group">
      <label>Delete Account</label>
      <button>Delete Account</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      lastName: {
        showForm: false,
        value: "",
      },
      firstName: {
        showForm: false,
        value: "",
      },
      email: {
        showForm: false,
        value: "",
      },
    };
  },
  methods: {
    handleLoadForm: function (name) {
      if (name === "lastName") {
        this.lastName.value = this.computeLastName;
        this.lastName.showForm = true;
      } else if (name === "firstName") {
        this.firstName.value = this.computeFirstName;
        this.firstName.showForm = true;
      } else if (name === "email") {
        this.email.value = this.computeEmail;
        this.email.showForm = true;
      }
    },
    handleSubmit: async function (name) {
      const userId = this.$store.state.user._id;

      // TODO: Make more DRY

      switch (name) {
        case "lastName": {
          const user = await this.$http.post(`/api/user/${userId}`, {
            last_name: this.lastName.value,
          });

          console.log(user);
          break;
        }
        case "firstName": {
          const user = await this.$http.post(`/api/user/${userId}`, {
            first_name: this.firstName.value,
          });

          console.log(user);
          break;
        }
        case "email": {
          const user = await this.$http.post(`/api/user/${userId}`, {
            email: this.email.value,
          });

          console.log(user);
          break;
        }
        default: {
          break;
        }
      }

      // TODO: Need to update store with new information
    },
    handleClose: function (name) {
      this[name].showForm = false;
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

    img {
      width: 100%;
      height: 100%;
    }
  }

  .header-text {
    h2 {
      font-size: 2em;
      text-transform: capitalize;
    }

    p {
      margin-top: 1em;

      span.text-divider {
        color: transparentize($color: white, $amount: 0.75);
      }
    }
  }
}

.divider {
  margin: 2.5em 0;
  border-color: transparentize($color: white, $amount: 0.8);
}

.input-group {
  margin-bottom: 2em;

  label {
    display: block;
    color: transparentize($color: white, $amount: 0.7);
    margin-bottom: 1em;
  }

  p {
    a {
      color: cadetblue;
      display: block;
      margin-top: 0.8em;
    }
  }
}

@media screen and (min-width: 446px) {
  .input-group p {
    a {
      display: inline;
      padding-left: 2em;
    }
  }
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

    .input-group {
      width: 50%;
    }
  }
}
</style>