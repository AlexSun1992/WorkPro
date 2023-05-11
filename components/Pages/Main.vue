<template>
  <div class="wrapper main_page">
    <div class="animated fadeIn">
      <div>
        <div class="justify-content-lg-center">
          <DynamicRoutesRenderer />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicRoutesRenderer from "~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer";
import consts from "@/api/urls";

export default {
  scrollToTop: true,
  layout: "MainLayout",
  components: { DynamicRoutesRenderer },
  async fetch({ $axios, $auth }) {
    try {
      const data = await $axios.get(`${consts.USERPROFILE}`);
      if (data?.data) {
        $auth.setUser(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss">
.main_page {
  @import "~/assets/scss/main.scss";
}
</style>
