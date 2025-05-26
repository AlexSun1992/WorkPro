<template>
  <div class="container">
    <div
      v-if="data && data.length > 0"
      class="offices"
    >
      <div
        v-for="(office, index) in data"
        :key="index"
      >
        <OfficeCardMobile
          v-if="mobile"
          @open="$emit('open', $event)"
          :office="office"
        />
        <OfficeCard
          v-else
          @open="$emit('open', $event)"
          :office="office"
          :showOnMapButton="true"
        />
      </div>
    </div>
    <div v-else>
      <div class="search-no-result-img"></div>
      <div class="search-no-result-txt">По вашему запросу ничего не найдено</div>
    </div>
    <button
      v-if="mobile && data.length >= 6"
      class="mobile-pagination"
      type="button"
      @click="showMore"
      :class="[!isShownMore ? 'open' : 'close']"
    >
      {{ !isShownMore ? "Показать еще" : "Свернуть" }}
    </button>
  </div>
</template>

<script>
/* eslint-disable */
import OfficeCard from "./OfficeCard.vue";
import OfficeCardMobile from "./OfficeCardMobile.vue";
export default {
  name: "OfficesList",
  props: {
    data: {
      type: Array,
    },
    mobile: {
      type: Boolean,
    },
    station: {
      type: String,
    },
  },
  components: {
    OfficeCard,
    OfficeCardMobile,
  },
  data() {
    return {
      isShownMore: false,
    };
  },
  methods: {
    showMore() {
      this.isShownMore = !this.isShownMore;
      this.$emit("showMore", this.isShownMore);
    },
  },
};
</script>

<style scoped></style>
