<template>
  <div>
    <div v-if="balloonWithFavorite">
      <CardFavourite
        v-for="card in converterData"
        :data="card"
        :key="card.SNAME"
        :hasChooseButton="hasChooseButton"
      >
      </CardFavourite>
    </div>
    <div v-else>
      <div
        v-for="card in converterData"
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
            id="btn"
            :data-alt-id="card.ID"
            type="button"
            class="btn-secondary mt-4 btn-baloon"
            @click="redirect(card.SREDIRECT)"
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
          <div
            v-for="comment in card.SCOMMENT"
            class="map-balloon-description mt-3"
            :key="comment"
          >
            {{ comment }}
          </div>
          {{ card }}

          <div
            class="mt-2"
            v-for="item in card.SPHONE"
            :key="item.SPHONEID"
          >
            <a :href="`tel:${item.SPHONE}`">{{ item.SPHONE }}</a>
            {{ item.SPHONE_TEXT }}<br />
          </div>
          <button
            v-if="isShowDefaultButton"
            id="btn"
            :data-alt-id="card.ID"
            type="button"
            class="btn-secondary mt-4 btn-baloon"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardFavourite from "../ControlSelectObjectFromMap/CardFavourite";

export default {
  name: "BaloonMap",
  components: { CardFavourite },
  props: {
    data: {
      type: [Object, Array],
      required: true,
      default: () => {},
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
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
      return this.converterData?.every((el) => "SBUTTONTEXT" in el && el.SBUTTONTEXT.length);
    },
    converterData() {
      return Array.isArray(this.data) ? this.data : [this.data];
    },
    balloonWithFavorite() {
      return Array.isArray(this.data) ? this.data.some((item) => "LFAV" in item) : false;
    },
    isShowDefaultButton() {
      return this.$route.params.idItem !== "8";
    },
  },
};
</script>
