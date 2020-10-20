<template>
  <div>
    <div v-if="getPage && getPage.content">
      <v-runtime-template
        :template="getPage.content.rendered"
      ></v-runtime-template>
    </div>
    <div v-else-if="getPage.status == '404'">
      <div class="container">
        <h1>404 Страница не найдена</h1>
      </div>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import Calculator from "../../Pages/Calculator";
import { mapGetters } from "vuex";

export default {
  layout: "MainLayout",
  head() {
    return {
      title: this.getPage?.title?.rendered,
    };
  },
  components: { VRuntimeTemplate, Calculator },
  data() {
    return {
      counter: 0,
      dropDownValueSelected: { textSelected: null, valueSelected: null },
      textSelected: null,
      valueSelected: null,
    };
  },
  computed: {
    getPage() {
      return this.$store.getters["pages/getPageByUrl"];
    },
    isLoading() {
      return this.$store.getters["pages/getLoading"];
    },
    ...mapGetters("slider", ["isButtonLeftDisabled", "isButtonRightDisabled"]),
  },
};
</script>
