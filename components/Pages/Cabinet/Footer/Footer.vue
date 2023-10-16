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

  async fetch() {
    this.footerHTML = await axios
      .get(
        "https://reso.ru/system/modules/ru.reso.v2/templates/common/footer.jsp"
      )
      .then((res) => res.data);
  },
};
</script>

<style scoped></style>
