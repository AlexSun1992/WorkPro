<template>
  <div class="container">
    <div v-if="data && data.length" class="offices">
      <div v-for="(office, index) in data" :key="index">
        <OfficeCardMobile
          v-if="mobile"
          @open="$emit('open', $event)"
          :office="office"
        />
        <OfficeCard v-else @open="$emit('open', $event)" :office="office" />
      </div>
    </div>
    <button
      v-if="!station && mobile"
      class="mobile-pagination"
      type="button"
      @click="showMore"
    >
      {{ !isShownMore ? "Показать еще" : "Свернуть" }}
    </button>
    <!-- <div v-else>
      <div class="row search-result-row">
        <div class="col-md-12 col-12 search-results">
          <div class="search-no-result">
            <div class="search-no-result-img"></div>
            <div class="search-no-result-txt">
              По вашему запросу ничего не найдено
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
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
      page: 0,
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

<style scoped>
.empty {
  display: flex;
  justify-content: center;
}
</style>
