<template>
  <div>
    <div v-if="balloonWithFavorite">
      <CardFavourite
        v-for="card in converterData"
        :data="card"
        :key="card.SNAME"
        :hasChooseButton="hasChooseButton"
        :item-id="itemId"
        @update="handleSelect"
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
            :class="getButtonClass(card)"
            @click="handleSelect(card.ID)"
          >
            {{ getButtonText(card) }}
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
            @click="handleSelect(card.ID)"
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
      default: () => ({}),
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: Number,
      default: undefined,
    },
    selectedId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isChooseButton: false,
    };
  },
  methods: {
    handleSelect(id) {
      const card = this.converterData.find((itm) => itm.ID === id);
      if (card.SREDIRECT) {
        this.$router.push(card.SREDIRECT);
      }
      this.$emit("select", id);
    },
    getButtonText(card) {
      return this.selectedId === card.ID ? card.SBUTTONTEXT[1] : card.SBUTTONTEXT[0];
    },
    getButtonClass(card) {
      return `mt-4 btn-baloon ${this.selectedId === card.ID ? "btn-primary" : "btn-secondary"}`;
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
      // TODO: Cannot use 'in' operator to search for 'LFAV' in undefined
      return this.converterData.some((item) => (item ? "LFAV" in item : false));
    },
    isShowDefaultButton() {
      return this.$route.params.idItem !== "8";
    },
  },
};
</script>
