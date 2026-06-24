<template>
  <div class="position-relative">
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
    />

    <div
      v-if="isStatePay"
      class="payment_fail"
    >
      Не оплачен
    </div>
  </div>
</template>

<script>
import ControlDynamicList from "./ControlDynamicList.vue";
// eslint-disable-next-line
import { isTrue } from "@/components/Libs/Controls/AMCBoolean.helper";
// eslint-disable-next-line import/named
import { paymentText } from "./ControlDynamicDepend.helper.fixtures";

export default {
  name: "ControlDynamicDepend",
  components: { ControlDynamicList },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paymentText,
    };
  },
  computed: {
    options() {
      return this.data?.options;
    },

    isOnSale() {
      return Boolean(this.options?.[0]?.SFULLPRICE);
    },

    isStatePay() {
      return isTrue(this.options?.[0]?.LSTATEPAY);
    },

    formattedPrice() {
      const rawPrice = this.getCurrentPrice();

      return this.data.fullPrice?.toLocaleString("ru-RU") || this.formatPrice(rawPrice);
    },

    formattedOriginalPrice() {
      if (!this.isOnSale) {
        return "";
      }

      return this.formatPrice(this.getOriginalPrice());
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

      return "options" in this.data ? `${this.options?.[0].SCOMMENT_DYNAMIC}${options}` : "";
    },

    textForDynamicList() {
      if (this.showDescription) {
        return this.additionalOptions;
      }

      if (this.options?.length) {
        return "SCOMMENT" in this.options[0] ? this.options[0]?.SCOMMENT : "";
      }

      return "";
    },
  },

  created() {
    if ("options" in this.data) {
      this.updateValue(this.options[0]?.value);
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
      if (!this.data) {
        return "";
      }

      const firstOption = this.options?.[0];

      if (firstOption?.value != null) {
        return String(firstOption.value);
      }

      return String(this.data.value) || "";
    },

    getOriginalPrice() {
      return this.options?.[0]?.SFULLPRICE || "";
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
.payment_fail {
  background: #eb5757 url(/img/payment_fail.svg) right 12px top 50% no-repeat;
  font-size: 1.125rem;
  color: #fff;
  border-radius: 100px;
  line-height: 30px;
  display: inline-block;
  padding: 4px 43px 4px 12px;
  top: -43px;
  right: 0px;
  position: absolute;
}

@media (max-width: 992px) {
  .price span {
    font-size: 1.5rem;
    white-space: nowrap;
    line-height: 30px;
  }
  .payment_fail {
    font-size: 0.875rem;
    line-height: 24px;
  }
}
</style>
