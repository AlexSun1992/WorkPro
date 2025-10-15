<template>
  <div>
    <div @click.stop="chooseCard">
      <p>{{ police.text }}</p>
      <p v-if="isFranshiseString">{{ police.SFRANCHISE }}</p>
      <p v-if="isPoliceOptional">{{ policeOptionalText }}</p>
      <ControlDropdown
        v-if="isFranchiseList"
        :options="isFranchiseList"
        :isStopPropagation="true"
        :optionsComputed="data.options"
        :labelName="police.SFRANCHISETEXT"
        v-model="valueComputed"
        placeholder="Выберите..."
      />

      <div class="variant-cost">Базовая цена {{ formattedNum(police.NPRICE) }}&#8381;</div>
      <div
        v-if="police.NDISCOUNT"
        class="variant-cost"
      >
        Цена со скидкой {{ formattedNum(police.NDISCOUNT) }}&#8381;
      </div>
      <div
        v-for="elem in policyOptions"
        :key="elem.ID"
      >
        {{ elem.sname ? elem.sname : elem }}

        <span
          v-if="elem.stooltip"
          class="position-relative"
          >&nbsp;
          <span class="tooltipster">
            (?)<vue-easy-tooltip
              :with-arrow="true"
              position="top"
              :offset="4"
            >
              <span>{{ elem.stooltip }}</span></vue-easy-tooltip
            >
          </span>
        </span>
      </div>

      <control-modal
        ref="modal"
        :isOpen="true"
        :closeOnESC="true"
        :show-cancel="false"
        :show-close="true"
        :show-ok="false"
      >
        <template v-slot:default>
          <div
            v-for="elem in infoDanger"
            :key="elem.sdescription"
          >
            <p v-if="elem.stitle">
              <strong>{{ elem.stitle }}</strong>
            </p>
            <p v-if="elem.sdescription">{{ elem.sdescription }}</p>
          </div>
        </template>
      </control-modal>
    </div>

    <button
      v-if="police.SDETAILS && police.SDETAILSTEXT"
      @click.stop="getRequestData(police.ID)"
    >
      {{ police.SDETAILSTEXT }}
    </button>

    <button
      v-if="police.SDOWNLOAD && police.SLOADTEXT"
      @click.stop="downloadFile(police.SDOWNLOAD)"
    >
      {{ police.SLOADTEXT }}
    </button>
  </div>
</template>

<script>
import { formattedNumber } from "@/components/Libs/Controls/ControlInsuredBox/formattedNumber";

import ControlDropdown from "@/components/Libs/Controls/ControlDropdown/ControlDropdown";

import ControlModal from "@/components/Libs/Controls/AsyncModalAction/ControlModal";

import { saveFileAxios } from "@/utils/saveFile";

export default {
  name: "NewVariantPolicy",
  components: { ControlDropdown, ControlModal },
  props: {
    data: {
      type: Object,
      default: () => ({
        options: [],
      }),
    },
    value: {
      type: [Number, Object],
      default: () => ({}),
    },
    police: {
      type: Object,
      default: null,
    },
    defaultValue: {
      type: [Number, Object],
      required: false,
    },
    firstValueFranchise: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      infoDanger: null,
      dangerInfoTemplates: null,
    };
  },

  created() {
    this.dangerInfoTemplates = this.data.options?.filter((el) => el?.SDETAILS && el?.SDETAILS !== null);
  },
  computed: {
    valueComputed: {
      get() {
        return this.value?.el !== undefined ? this.value.value : this.defaultValue ?? this.firstValueFranchise;
      },
      set(val) {
        this.$emit("input", { value: val, el: this.police });
      },
    },

    policyOptions() {
      try {
        if (Array.isArray(this.police.SPOLICYOPTIONS)) {
          return this.police.SPOLICYOPTIONS;
        } else {
          return JSON.parse(this.police.SPOLICYOPTIONS);
        }
      } catch (error) {
        console.log("Ошибка парсина в JSON", error);
        return [];
      }
    },

    isFranshiseString() {
      return typeof this.police?.SFRANCHISE === "string" && !this.police.SFRANCHISE.trim().startsWith("[");
    },

    policeOptionalText() {
      if (this.police.SOPTIMAL === "Y") {
        return this.police.SOPTIMALTEXT || "Оптимальный";
      }
      return null;
    },

    isPoliceOptional() {
      return this.police.SOPTIMAL === "Y";
    },

    isFranchiseList() {
      const franchiseData = this.police?.SFRANCHISE;

      if (typeof franchiseData !== "string") {
        return false;
      }

      const trimmedData = franchiseData.trim();

      if (!trimmedData.startsWith("[")) {
        return false;
      }

      try {
        const parsedData = JSON.parse(trimmedData);

        if (!Array.isArray(parsedData)) {
          return false;
        }

        return parsedData.map((item) => ({
          value: item.id,
          text: item.sname ? `${item.sname.toLocaleString("ru-RU")} ₽` : "",
        }));
      } catch (error) {
        return false;
      }
    },
  },

  methods: {
    async downloadFile(url) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        const response = await this.$axios.get(path, {
          responseType: "blob", // Важно для файлов
          headers: {
            Accept: "application/octet-stream",
          },
        });

        saveFileAxios(response);
      } catch (error) {
        console.error("Download error:", error);
        window.open(url, "_blank");
      }
    },
    getRequestData(el) {
      try {
        const dangerDetails = this.dangerInfoTemplates.find((item) => item.ID === el)?.SDETAILS;
        if (!dangerDetails) {
          this.infoDanger = [];
        } else if (Array.isArray(dangerDetails)) {
          this.infoDanger = dangerDetails;
        } else {
          this.infoDanger = JSON.parse(dangerDetails);
        }
        this.$refs.modal.openModal();
      } catch (error) {
        console.error("Ошибка парсинга JSON", error);
        this.infoDanger = [];
      }
    },

    closeModal() {
      this.$refs?.modal?.closeModal(true);
    },

    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },
    chooseCard(event) {
      // Проверяем, что клик был не по кнопке
      if (event.target.tagName === "BUTTON" || event.target.closest("button")) {
        return;
      }
      const isSameCard = this.value?.el?.ID === this.police?.ID;
      const isValidObject = this.value && typeof this.value === "object" && "el" in this.value;

      if (isValidObject && isSameCard) {
        this.$emit("input", this.value);
      } else {
        this.$emit("input", this.police);
      }
    },
  },
};
</script>

<style scoped>
.default_border {
  border: 1px solid #d1d5db;
  border-radius: 12px;
}
.variant-cost {
  background: #eff1f3;
  color: #292929;
  border-radius: 15px;
  text-align: center;
  width: 100%;
  height: 42px;
  font-weight: 700;
  line-height: 42px;
}
</style>
