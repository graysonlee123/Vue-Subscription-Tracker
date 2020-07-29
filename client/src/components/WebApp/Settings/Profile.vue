<template>
  <div>
    <header>
      <div class="img-container">
        <img src="http://via.placeholder.com/200" alt="Avatar" />
      </div>
      <div class="header-text">
        <h2>{{fullName}}</h2>
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
      <p>
        {{email}}
        <a>Change Email</a>
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
        <p>
          {{firstName}}
          <a>Update</a>
        </p>
      </div>
      <div class="input-group">
        <label>Last Name</label>
        <p>
          {{lastName}}
          <a>Update</a>
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
  computed: {
    firstName: function () {
      return this.$store.state.user.first_name;
    },
    lastName: function () {
      return this.$store.state.user.last_name;
    },
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    email: function () {
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
  margin-bottom: 3em;

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