<template>
  <div>
    <div
      style="cursor: pointer"
      :class="'ppl-info percent' + percent + ' ppl-' + sex"
    >
      <div @click="goToProfile">
        <span class="ppl-name">{{ user }}</span>
      </div>
    </div>

    <!-- <div>
   <span class="ppl-name">{{ user }}</span>
   <p>заполните профиль</p>
    <ControlProgressbar
    :profileFullness="loggedInUser">
    </ControlProgressbar>
</div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HeaderUserInfo",
  props: {
    userData: {
      type: Object,
      default: null,
    },
  },

  methods: {
    goToProfile() {
      $nuxt._router.push(`/cabinet/${this.$route.params.idModule}/0/710`);
    },
  },
  computed: {
    user() {
      if (this.userData) {
        return `${this.userData.SFIRSTNAME} ${this.userData.SSECONDNAME}`;
      }
      return "";
    },
    percent() {
      if (this.userData) {
        return this.userData.NPROFILEFULLNESS;
      }
      return "";
    },
    sex() {
      if (this.userData) {
        return this.userData.BSEX === 1 ? "male" : "female";
      }
      return "";
    },

    ...mapGetters(["loggedInUser"]),
  },
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
