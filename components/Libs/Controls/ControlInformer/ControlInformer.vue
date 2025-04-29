<template>
  <div
    v-if="this.data.value !== undefined"
    v-html="getValue"
    :class="classObject"
  ></div>
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
        htmlStyleSuccess: this.data.name === "SSUCCESS_INFO",
        htmlStyleWarning: this.data.name === "SWARNING_INFO",
        htmlStyleError: this.data.name === "SERROR_INFO",
        htmlStyleInformation: this.data.name === "SHELP_INFO",
      };
    },

    getValue() {
      if (this.data.value) {
        return this.data.value;
      }
    },
  },
};
</script>

<style scoped>
.htmlStyleSuccess {
  background: #fff url(/img/informer-sc.svg) left 16px top 12px no-repeat;
  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 16px;
}
.htmlStyleWarning {
  background: #fff url(/img/informer-war.svg) left 16px top 12px no-repeat;

  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 16px;
}
.htmlStyleError {
  background: #fff url(/img/informer-er.svg) left 16px top 12px no-repeat;

  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 16px;
}
.htmlStyleInformation {
  background: #fff url(/img/informer-info.svg) left 16px top 12px no-repeat;
  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 16px;
}

.conf-block .htmlStyleSuccess {
  background: #edf8ea url(/img/informer-sc.svg) left 16px top 12px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  box-shadow: none;
  color: #292929;
}
.conf-block .htmlStyleWarning {
  background: #fff1eb url(/img/informer-war.svg) left 16px top 12px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: none;
}
.conf-block .htmlStyleError {
  background: #ffebeb url(/img/informer-er.svg) left 16px top 12px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: none;
}
.conf-block .htmlStyleInformation {
  background: #ecf3fa url(/img/informer-info.svg) left 16px top 12px no-repeat;
  border-radius: 30px;
  padding: 16px 32px 16px 64px;
  color: #292929;
  box-shadow: none;
}

.htmlStyleSuccess a,
.htmlStyleWarning a,
.htmlStyleError a,
.htmlStyleInformation a {
  color: #43b02a;
  text-decoration: none;
}
.htmlStyleSuccess a:hover,
.htmlStyleWarning a:hover,
.htmlStyleError a:hover,
.htmlStyleInformation a:hover {
  color: #43b02a;
  text-decoration: underline;
}

.conf-block .htmlStyleSuccess a {
  color: #43b02a;
  text-decoration: none;
}
.conf-block .htmlStyleWarning a {
  color: #fe7333;
  text-decoration: none;
}
.conf-block .htmlStyleError a {
  color: #eb5757;
  text-decoration: none;
}
.conf-block .htmlStyleInformation a {
  color: #3b86c8;
  text-decoration: none;
}
.conf-block .htmlStyleSuccess a:hover {
  color: #43b02a;
  text-decoration: underline;
}
.conf-block .htmlStyleWarning a:hover {
  color: #fe7333;
  text-decoration: underline;
}
.conf-block .htmlStyleError a:hover {
  color: #eb5757;
  text-decoration: underline;
}
.conf-block .htmlStyleInformation a:hover {
  color: #3b86c8;
  text-decoration: underline;
}
</style>
