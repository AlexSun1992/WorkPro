<template>
  <div>
    <div
      v-for="card in data"
      :key="card.ID"
    >
      <div
        class="map-balloon"
        v-if="isShow"
      >
        <div class="map-balloon-title">
          {{ card.SNAME }}
        </div>
        <div class="map-balloon-adress">
          {{ card.SADDRESS }}
        </div>
        <button
          :id="card.ID"
          type="button"
          class="btn-secondary mt-4 btn-baloon"
          @click="redirect(card)"
        >
          {{ card.SBUTTONTEXT[0] }}
        </button>
      </div>

      <div
        class="map-balloon"
        v-else
      >
        <div class="map-balloon-title">{{ card.SNAME }}</div>
        <div class="map-balloon-adress">Адрес: {{ card.SADDRESS }}</div>
        <div class="map-balloon-description mt-3">{{ card.SCOMMENT }}</div>
        <div
          class="mt-2"
          v-for="item in card.SPHONE"
          :key="item.SPHONEID"
        >
          <a :href="`tel:${item.SPHONE}`">{{ item.SPHONE }}</a>
          {{ item.SPHONE_TEXT }}<br />
        </div>
        <button
          v-if="isShowDefaulteButton"
          :id="card.ID"
          type="button"
          class="btn-secondary mt-4 btn-baloon"
        >
          Выбрать
        </button>
      </div>
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
  data() {
    return {
      isChooseButton: false,
    };
  },
  methods: {
    redirect(card) {
      if (card.SREDIRECT) {
        this.$router.push(link);
      }
    },
  },
  computed: {
    isShow() {
      return this.data.every((el) => "SBUTTONTEXT" in el && el.SBUTTONTEXT.length);
    },
  },
  isShowDefaultButton() {
    return this.$route.params.idItem !== "8";
  },
};
</script>
