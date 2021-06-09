<template>
<div>
  <div
    style="cursor: pointer"
    :class="'ppl-info percent' + percent + ' ppl-' + sex"
  >
    <div @click="goToProfile">
      <div class="ppl-avatar">
        <img src="" />
      </div>
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

import ControlProgressbar from "~/components/Libs/Controls/ControlProgressbar"
import { mapGetters } from 'vuex';

export default {
  components: { ControlProgressbar },
  name: "HeaderUserInfo",
  props: ["userData"],
   

  methods: {
    goToProfile() {
      console.log(this.userData)
      $nuxt._router.push(`/cabinet/${this.$route.params.idModule}/0/710`);
    },
  },
  computed: {
    user() {
      if (this.userData && this.userData[0]) {
        return `${this.userData[0]._data[0].SFIRSTNAME} ${this.userData[0]._data[0].SSECONDNAME}`;
      }
    },
    percent() {
      if (this.userData && this.userData[0]) {
        return this.userData[0]._data[0].NPROFILEFULLNESS;
      }
    },
    sex() {
      if (this.userData && this.userData[0]) {
        return this.userData[0]._data[0].BSEX === 1 ? "male" : "female";
      }
    },

    ...mapGetters(['loggedInUser'])

  },
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
