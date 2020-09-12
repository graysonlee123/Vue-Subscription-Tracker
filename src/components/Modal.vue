<template>
  <transition name="modal" mode="out-in">
    <div id="modal" v-if="modal" :class="{[modal.type]: true}">
      <p>{{modal.message}}</p>
      <div class="modal__close" @click="handleCloseModal(modal.uuid)">
        <i class="fa fa-times"></i>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    handleCloseModal(uuid) {
      this.$store.commit("remove_modal", uuid);
    },
  },
  computed: {
    modal() {
      return this.$store.getters.alert;
    },
  },
};
</script>

<style lang="scss" scoped>
#modal {
  position: fixed;
  top: 50px;
  left: 50%;
  margin-left: -200px + 40px; // Should be half self width and half navbar width
  width: 400px;
  background-color: #eee;
  color: var(--textDark);
  border-radius: var(--borderRadius);
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  z-index: 10;
  font-size: 1.2rem;

  &.success {
    background-color: var(--success);
    color: var(--successFaint);
  }

  &.danger {
    background-color: var(--danger);
    color: var(--dangerFaint);
  }

  &.neutral {
    background-color: grey;
    color: var(--textdark);
  }

  p {
    padding: 1em;
    flex-grow: 1;
  }

  div.modal__close {
    padding: 1em;
    border-left: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
  }
}

@media screen and (max-width: 767px) {
  #modal {
    width: 280px;
    margin-left: -140px;
    top: 72px;
  }
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 300ms ease-in-out, transform 200ms ease;
}

.modal-enter-to,
.modal-leave {
  opacity: 1;
  transform: translateY(0);
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>