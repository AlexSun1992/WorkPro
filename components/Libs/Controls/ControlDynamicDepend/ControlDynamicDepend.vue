<template>
  <div>
    <div class="price">
      <span :class="isOnSale ? 'red-price price-amount' : 'price-amount'">{{ formattedPrice }}</span>
      <span
        v-if="isOnSale"
        class="original-price price-amount"
        >{{ formattedOriginalPrice }}</span
      >
    </div>
    <control-dynamic-list
      v-if="textForDynamicList"
      :data="createData"
    ></control-dynamic-list>
  </div>
</template>

<script>
import ControlDynamicList from "./ControlDynamicList.vue";

export default {
  name: "ControlDynamicDepend",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { ControlDynamicList },

  watch: {
    value(newV, oldV) {
      if (oldV !== newV) {
        this.updateValue(newV);
      }
    },
  },

  created() {
    if ("options" in this.data) {
      this.updateValue(this.data?.options[0]?.value);
    }
  },

  methods: {
    updateValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value,
      });
    },

    formatPrice(value) {
      if (value == null || value === "" || isNaN(Number(value))) {
        return "";
      }

      return new Intl.NumberFormat("ru-RU").format(Number(value));
    },

    getCurrentPrice() {
      if (!this.data) return "";

      const firstOption = this.data?.options?.[0];
      if (firstOption?.value != null) {
        return String(firstOption.value);
      }

      return String(this.data.value) || "";
    },

    getOriginalPrice() {
      return this.data?.options?.[0]?.SFULLPRICE || "";
    },
  },
  computed: {
    isOnSale() {
      return Boolean(this.data?.options?.[0]?.SFULLPRICE);
    },

    formattedPrice() {
      const rawPrice = this.getCurrentPrice();
      return this.data.fullPrice?.toLocaleString("ru-RU") || this.formatPrice(rawPrice);
    },

    formattedOriginalPrice() {
      if (!this.isOnSale) return "";

      const rawOriginalPrice = this.getOriginalPrice();
      return this.formatPrice(rawOriginalPrice);
    },

    createData() {
      return {
        options: [
          {
            text: this.textForDynamicList,
          },
        ],
      };
    },

    showDescription() {
      return this.formattedPrice.replace(/\s/g, "") !== this.getCurrentPrice();
    },

    additionalOptions() {
      const options = this.data?.additional?.reduce((acc, cur) => `${acc}\n${cur}`, "");
      return "options" in this.data ? `${this.data?.options[0].SCOMMENT_DYNAMIC}${options}` : "";
    },

    textForDynamicList() {
      if (this.showDescription) {
        return this.additionalOptions;
      }
      if ("options" in this.data && this.data?.options.length) {
        return "SCOMMENT" in this.data?.options[0] ? this.data?.options[0]?.SCOMMENT : "";
      }
      return "";
    },
  },
};
</script>

<style scoped>
.price {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 3rem;
  font-weight: 700;
  font-family: Raleway;
  font-feature-settings: "pnum" on, "lnum" on;
  line-height: 77px;
}

.price-amount {
  position: relative;
}

.price-amount:after {
  content: "\20BD";
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif, "Apple Color Emoji";
  padding-left: 10px;
}

.red-price {
  color: #eb5757;
}

.original-price {
  color: #c3c3c3;
  text-decoration: line-through;
}
.price span {
  font-size: 3rem;
  font-weight: 700;
  font-family: Raleway;
  font-feature-settings: "pnum" on, "lnum" on;
  line-height: 77px;
}
.price span + span {
  margin-left: 20px;
}
@media (max-width: 992px) {
  .price span {
    font-size: 1.5rem;
    white-space: nowrap;
    line-height: 30px;
  }
}
</style>
