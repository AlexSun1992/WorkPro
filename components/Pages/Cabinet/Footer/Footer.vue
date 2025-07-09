<template>
  <div v-html="footerHTML" />
</template>

<script>
import axios from "axios";

export default {
  name: "Footer",
  data() {
    return {
      footerHTML: null,
    };
  },

  async mounted() {
    this.footerHTML = await axios.get(`/system/modules/ru.reso.v2/templates/common/footer.jsp`).then((res) => res.data);
  },
};
</script>

<style scoped></style>
