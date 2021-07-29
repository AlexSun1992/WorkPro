<template>
  <div>
    <div v-if="items">
      <FileLoader :item="items[0]" table-id="9662" />
    </div>
  </div>
</template>

<script>
import FileLoader from "../../../components/Pages/Table/FileLoader";

export default {
  name: "ControlUploader",
  components: {
    FileLoader,
  },
  data() {
    return {
      items: null,
    };
  },
  async fetch() {
    let data = await this.$axios.$get(
      "/am/main/v2/data/27/983?json={pIdDocPhoto:1351480299}"
    );
    this.items = data[0]._data;
  },
};
</script>

<style scoped></style>
