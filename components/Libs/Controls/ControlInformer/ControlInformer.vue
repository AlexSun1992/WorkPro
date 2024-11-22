<template>
  <div v-html="getValue" :class="classObject"></div>
</template>

<script>
export default {
  name: "ControlInformer",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      className: this.data.name,
    };
  },

  computed: {
    classObject() {
      return {
        htmlStyleSuccess: this.data.name === "SINFORMER_SUCCESS",
        htmlStyleWarning: this.data.name === "SINFORMER_WARNING",
        htmlStyleError: this.data.name === "SINFORMER_ERROR",
        htmlStyleInformation:
          this.data.name !== "SINFORMER_SUCCESS" &&
          this.data.name !== "SINFORMER_WARNING" &&
          this.data.name !== "SINFORMER_ERROR",
      };
    },

    getValue() {
      if (this.data.value) {
        return this.data.value;
      }
      return "<div>TEEST INFORMER</div><br><span>Test information message!<span>";
    },
  },
};
</script>

<style scoped>
.htmlStyleSuccess {
  background: #edf8ea url(/img/informer-sc.svg) left 16px top 16px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
}
.htmlStyleWarning {
  background: #fff1eb url(/img/informer-war.svg) left 16px top 16px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
}
.htmlStyleError {
  background: #ffebeb url(/img/informer-er.svg) left 16px top 16px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
}
.htmlStyleInformation {
  background: #ecf3fa url(/img/informer-info.svg) left 16px top 16px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
}
</style>
