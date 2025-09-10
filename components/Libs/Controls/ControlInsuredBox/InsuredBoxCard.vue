<template>
  <div>
    <div
      :id="data.fieldId"
      :class="getPresetsClass(index)"
      @click="updateField(getPolicyCardOptions.ID)"
    >
      <div class="box-title">{{ getPolicyCardOptions.SNAME }}</div>
      <div class="box-description">
        <div
          v-if="isLabel"
          class="box-flag"
        >
          {{ getPolicyCardOptions.SLABEL }}
        </div>
        <div
          v-for="(policyOption, index) in card"
          :key="index"
        >
          <InsuredBoxField
            :policyOption="policyOption"
            :tooltip="tooltipData[index]"
          />
        </div>
      </div>
      <div
        v-if="getPolicyCardOptions.NCOST"
        ref="button"
        class="box-button"
      >
        <div v-html="priceRender"></div>
      </div>
      <div
        v-if="getPolicyCardOptions.SDOWNLOAD"
        class="text-center mt-3"
      >
        <button
          class="dwnld-btn"
          @click.stop="downloadFile(getPolicyCardOptions.SDOWNLOAD)"
        >
          {{ getPolicyCardOptions.SLOADTEXT
          }}<svg
            class="btn-upload-icon"
            style="margin-left: 10px"
            width="20"
            height="20"
          >
            <use xlink:href="/galleries/icons/main/sprite_load_files.svg#icon-1"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import InsuredBoxField from "./InsuredBoxField.vue";
import { formattedNumber } from "./formattedNumber";
import { saveFileAxios } from "@/utils/saveFile";

export default {
  name: "ControlInsuredBoxCard",
  components: { InsuredBoxField },
  props: {
    data: {
      type: Object,
      required: true,
    },
    card: {
      type: Array,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
    tooltipData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {};
  },
  created() {
    if (this.getData?.length > 3) {
      this.settings.centerMode = true;
    }
  },

  computed: {
    getPolicyCardOptions() {
      return this.data.options[this.index + 1];
    },
    isLabel() {
      return Boolean(this.getPolicyCardOptions?.SLABEL);
    },
    isDiscount() {
      return Boolean(this.getPolicyCardOptions?.NDISCOUNT);
    },

    priceRender() {
      const { SBASICCOST, NCOST, NDISCOUNT } = this.getPolicyCardOptions;
      if (!this.isDiscount) {
        return `
          <span>
            ${SBASICCOST}
            <span class="text-nowrap">${this.formattedNum(NCOST)} &#8381;</span>
          </span>
        `;
      }

      return `
        <span class="btn_two_line">
          ${SBASICCOST}
          <s>${this.formattedNum(NCOST)} &#8381;</s>
          <span>${NDISCOUNT} &#8381;</span>
        </span>
      `;
    },
  },
  methods: {
    formattedNum(obj) {
      return !isNaN(obj) ? formattedNumber(Number(obj)) : obj;
    },
    async downloadFile(url) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const response = await fetch(path);
        saveFileAxios(response);
      } catch (error) {
        console.error("Download error:", error);
        window.open(url, "_blank");
      }
    },
    updateField(cardId) {
      const updateData = {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: Number(cardId),
      };
      this.$emit("update", updateData);
    },
    getPresetsClass(index) {
      const even = index % 2 === 0;
      return {
        box: true,
        "box-green": even,
        "box-blue": !even,
        sale_btn: this.getPolicyCardOptions.NDISCOUNT && this.getPolicyCardOptions.NCOST,
        active: Number(this.data.value) === Number(this.getPolicyCardOptions.ID),
      };
    },
  },
};
</script>
<style scoped>
.box {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 49px auto auto;
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background-color: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 30px 11px 28px;
  position: relative;
  cursor: pointer;
  height: 100%;
}
.sale_btn.box {
  grid-template-rows: 49px auto 80px;
}

.box-title {
  font-family: Raleway;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  margin: 0 19px;
  border-bottom: 1px solid #c3c3c3;
  font-feature-settings: "pnum" on, "lnum" on;
}

.box-description {
  margin-bottom: 20px;
}
.box-button {
  padding: 11px 24px;
  border-radius: 15px;
  font-weight: 700;
  line-height: 1.25rem;
  text-align: center;
}
.box-green .box-button {
  background-color: #edf8ea;
  color: #009639;
}
.box-blue .box-button {
  background-color: #ecf3fa;
  color: #3b86c8;
}
.box-blue.active .box-button {
  background-color: #3b86c8;
  color: #fff;
}
.box-green.active .box-button {
  background-color: #009639;
  color: #fff;
}

.box-blue.active {
  border-color: #3b86c8;
}

.box-green.active {
  border-color: #009639;
}
.box-button::v-deep .btn_two_line {
  font-size: 1rem;
  line-height: 1.875rem;
}
.box-button::v-deep .btn_two_line span {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.875rem;
}
.dwnld-btn {
  border: 0;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 700;
}
.box-blue .dwnld-btn {
  color: #3b86c8;
}
.box-green .dwnld-btn {
  color: #43b02a;
}

.box-blue .dwnld-btn svg {
  stroke: #3b86c8;
}
.box-green .dwnld-btn svg {
  stroke: #43b02a;
}
.box-flag {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  padding: 4px 8px;
}
.box-blue .box-flag {
  background-color: #3b86c8;
}
.box-green .box-flag {
  background-color: #009639;
}
</style>
