<template>
  <ImageGallery
    v-if="urls && urls.length"
    :urls="urls"
  />
</template>

<script>
import ImageGallery from "./ImageGallery.vue";

export default {
  name: "ControlGallery",
  components: { ImageGallery },
  props: {
    data: {
      type: Object,
      default: () => ({ value: [] }),
    },
  },
  data() {
    return {
      urls: [],
    };
  },

  methods: {
    async createUrls() {
      const src = this.data?.value ?? [];
      const urls =
        src &&
        src.map(async (item) => ({
          name: item.name,
          url: await this.getUrl(item),
        }));

      this.urls = await Promise.all(urls);
    },

    getUrl(data) {
      const defUrl = "/am/main/v2/file";

      if (data.url) {
        return data.url;
      }

      return this.getAuthImg(`${defUrl}/${data?.id ?? 0}?rel=${data?.rel.replace("downloadphoto.aspx?id=", "") ?? 0}`);
    },

    async getAuthImg(url) {
      const resp = await this.$axios({
        url,
        method: "GET",
        responseType: "blob",
      });
      const blob = resp?.data;
      const ulr = blob && URL.createObjectURL(blob);

      return ulr ?? "";
    },
  },
  mounted() {
    this.createUrls();
  },
};
</script>

<style lang="scss" scoped></style>
