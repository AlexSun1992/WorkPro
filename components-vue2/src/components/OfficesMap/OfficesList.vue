<template>
  <div class="container">
    <div
      v-if="data && data.length"
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
        />
      </div>
    </div>
    <button
      v-if="!station && mobile && data.length >= 6"
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
import OfficeCard from "./OfficeCard";
import OfficeCardMobile from "./OfficeCardMobile";

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

<style scoped>
.empty {
  display: flex;
  justify-content: center;
}
</style>
