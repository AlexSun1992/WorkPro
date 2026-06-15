<template>
  <div>
    <div
      v-if="conformation"
      class="mb-1"
    >
      {{ showConformation() }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmModal",
  props: {
    conformation: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    showConformation() {
      this.$bvModal
        .msgBoxConfirm("Данный номер телефона уже зарегистрирован", {
          title: "Подтверждение продолжения регистрации",
          size: "md",
          buttonSize: "md",
          okVariant: "success",
          okTitle: "Продолжить",
          cancelTitle: "Авторизация",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          this.$emit("agree", value);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
