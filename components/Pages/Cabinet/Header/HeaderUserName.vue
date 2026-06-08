<template>
  <div>
    <div :class="`ppl-info percent${percent} ppl-${sex} cursor`">
      <div @click="goToProfile">
        <span class="ppl-name">{{ user }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderUserName",
  props: {
    userData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    user() {
      return this.userData ? `${this.userData.SFIRSTNAME} ${this.userData.SSECONDNAME}` : "";
    },
    percent() {
      return this.userData ? this.userData.NPROFILEFULLNESS : "";
    },
    sex() {
      if (this.userData) {
        return this.userData.BSEX === 1 ? "male" : "female";
      }
      return "";
    },
  },

  methods: {
    goToProfile() {
      $nuxt._router.push(`/cabinet/${this.$route.params.idModule}/0/710`);
    },
  },
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
