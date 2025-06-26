<template>
  <div>
    <div
      class="map-balloon"
      v-if="isShow"
    >
      <div class="map-balloon-title">
        {{ data.SNAME }}
      </div>
      <div class="map-balloon-adress">
        {{ data.SADDRESS }}
      </div>
      <button
        id="btn"
        type="button"
        class="btn-secondary mt-4"
        @click="redirect(data.SREDIRECT)"
      >
        {{ data.SBUTTONTEXT[0] }}
      </button>
    </div>

    <div
      class="map-balloon"
      v-else
    >
      <div class="map-balloon-title">{{ data.SNAME }}</div>
      <div class="map-balloon-adress">Адрес: {{ data.SADDRESS }}</div>
      <div class="map-balloon-description mt-3">{{ data.SCOMMENT }}</div>
      <div
        class="mt-2"
        v-for="item in data.SPHONE"
        :key="item.SPHONEID"
      >
        <a :href="`tel:${item.SPHONE}`">{{ item.SPHONE }}</a>
        {{ item.SPHONE_TEXT }}<br />
      </div>
      <button
        v-if="isShowDefaulteButton"
        id="btn"
        type="button"
        class="btn-secondary mt-4"
      >
        Выбрать
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaloonMap",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    redirect(link) {
      if (link) {
        this.$router.push(link);
      }
    },
  },
  computed: {
    isShow() {
      return "SBUTTONTEXT" in this.data && this.data.SBUTTONTEXT.length;
    },
  },
  isShowDefaultButton() {
    return this.$route.params.idItem !== "8";
  },
};
</script>
