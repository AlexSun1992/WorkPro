<template>
  <div class="nvpolicy">
    <div
      class="n-v-policy"
      @click.stop="chooseCard"
    >
      <div class="n-v-policy_title">
        {{ police.text }}
      </div>
      <div class="n-v-policy_price">
        <div
          v-if="isPoliceOptional"
          class="n-v-policy_flag"
        >
          {{ policeOptionalText }}
        </div>

        <span v-if="police.NDISCOUNT"> {{ formattedNum(police.NDISCOUNT) }}&nbsp;&#8381; </span>
        <span>{{ formattedNum(police.NPRICE) }}&nbsp;&#8381;</span>
      </div>
      <div class="n-v-policy_f">
        <div
          v-if="!police.SFRANCHISETEXT"
          class="n-v-policy-nf"
        >
          {{ police.SFRANCHISE }}
        </div>

        <ControlDropdown
          v-if="!isFranshiseString"
          v-model="valueComputed"
          :options="isFranchiseList"
          :data="{ label: police.SFRANCHISETEXT }"
          :is-stop-propagation="true"
          :options-computed="data.options"
          :label-name="police.SFRANCHISETEXT"
          placeholder="Выберите..."
        />
      </div>
      <div class="n-v-policy_options">
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
              <vue-easy-tooltip
                :with-arrow="true"
                position="top"
                :offset="4"
              >
                <span>{{ elem.stooltip }}</span></vue-easy-tooltip
              >
            </span>
          </span>
        </div>
      </div>
      <div class="n-v-policy_btn">
        <button
          v-if="police.SDETAILS && police.SDETAILSTEXT"
          class="btn-outline-black size-m"
          @click.stop="getRequestData(police.ID)"
        >
          {{ police.SDETAILSTEXT }}
        </button>

        <button
          v-if="police.SDOWNLOAD && police.SLOADTEXT"
          class="btn-outline-black size-m"
          @click.stop="downloadFile(police.SDOWNLOAD)"
        >
          {{ police.SLOADTEXT }}
        </button>
      </div>

      <control-modal
        v-if="police.SDETAILS && police.SDETAILSTEXT"
        ref="modal"
        :is-open="true"
        :close-on-esc="true"
        :close-on-out-side-click="true"
        :show-cancel="false"
        :show-close="true"
        :show-ok="false"
      >
        <template #default>
          <div>
            <div class="dialog-title">
              {{ police.text }}
            </div>
            <div
              v-for="elem in infoDanger"
              :key="elem.sdescription"
            >
              <div
                v-if="elem.stitle"
                class="stitle-icon"
              >
                <strong>{{ elem.stitle }}</strong>
              </div>
              <div
                v-if="elem.sdescription"
                class="px-3 mt-2"
              >
                {{ elem.sdescription }}
              </div>
            </div>
          </div>
        </template>
      </control-modal>
    </div>
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
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
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
    modelValue: {
      type: [Number, Object],
      default: undefined,
    },
    police: {
      type: Object,
      default: null,
    },
    defaultValue: {
      type: [Number, Object],
      default: 0,
    },

    choosenFranchise: {
      type: Number,
      default: 0,
    },

    firstValueFranchise: {
      type: Number,
      default: 0,
    },
    isAnyCardChoosenByClick: {
      type: Boolean,
      default: false,
    },
    choosenPoliceByDefault: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      infoDanger: null,
      dangerInfoTemplates: null,
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    valueComputed: {
      get() {
        const { choosenFranchise, defaultValue, firstValueFranchise } = this;
        const value = this.currentValue;

        //  Проверки по приоритету
        if (value?.el !== undefined) {
          return value.value;
        }

        if (choosenFranchise && this.choosenPoliceByDefault !== null) {
          return choosenFranchise;
        }

        return defaultValue ?? firstValueFranchise;
      },
      set(val) {
        const payload = { value: val, el: this.police };
        // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
        this.$emit("input", payload);
        this.$emit("update:modelValue", payload);
      },
    },

    policyOptions() {
      try {
        if (Array.isArray(this.police.SPOLICYOPTIONS)) {
          return this.police.SPOLICYOPTIONS;
        }
        return JSON.parse(this.police.SPOLICYOPTIONS);
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

  created() {
    this.dangerInfoTemplates = this.data.options?.filter((el) => el?.SDETAILS && el?.SDETAILS !== null);
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
      const value = this.currentValue;
      const isSameCard = value?.el?.ID === this.police?.ID;
      const isValidObject = value && typeof value === "object" && "el" in value;

      const payload = isValidObject && isSameCard ? value : this.police;
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", payload);
      this.$emit("update:modelValue", payload);
    },
  },
};
</script>

<style scoped>
.n-v-policy {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 59px 39px 24px auto minmax(0, max-content) 0;
  height: 100%;
  padding: 30px 20px;
}
.nvpolicy {
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background-color: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  position: relative;
  cursor: pointer;
  height: 100%;
}
.active.nvpolicy {
  border: 2px solid var(--lgreen, #43b02a);
}

.n-v-policy_title {
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--black);
  position: relative;
  padding-right: 34px;
}

.n-v-policy_title::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 34px;
  height: 34px;
  border: 2px solid var(--grey_40);
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 34px;
}
.n-v-policy_title::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  height: 10px;
}
.active .n-v-policy_title::after {
  border: 10px solid var(--lgreen, #43b02a);
}

.n-v-policy_flag {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 4px 4px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  padding: 4px 8px;
  background-color: var(--lgreen);
}
.n-v-policy_price span {
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2.4375rem;
  text-align: center;
  color: var(--lgreen);
  font-feature-settings: "pnum" on, "lnum" on;
}
.n-v-policy_price span + span {
  font-size: 1.25rem;
  line-height: 2.4375rem;
  color: var(--warmgrey_40);
  text-decoration: line-through;
  margin-left: 12px;
}

.n-v-policy::v-deep .control-dropdown-menu.visible {
  max-height: 153px;
  font-size: 1rem;
}
.n-v-policy_f {
  font-size: 0.75rem;
  align-self: center;
}
.dialog::v-deep .stitle-icon,
.n-v-policy_options > div {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42NzUyIDAuMzI0NzZDMTQuMTA4MyAwLjc1Nzc3MyAxNC4xMDgzIDEuNDU5ODMgMTMuNjc1MiAxLjg5Mjg0TDUuNTY2NDQgMTAuMDAxNkM1LjEzMzQzIDEwLjQzNDcgNC40MzEzNyAxMC40MzQ3IDMuOTk4MzYgMTAuMDAxNkwwLjMyNDc2IDYuMzI4MDRDLTAuMTA4MjUzIDUuODk1MDMgLTAuMTA4MjUzIDUuMTkyOTcgMC4zMjQ3NiA0Ljc1OTk2QzAuNzU3NzczIDQuMzI2OTUgMS40NTk4MyA0LjMyNjk1IDEuODkyODQgNC43NTk5Nkw0Ljc4MjQgNy42NDk1MkwxMi4xMDcyIDAuMzI0NzZDMTIuNTQwMiAtMC4xMDgyNTMgMTMuMjQyMiAtMC4xMDgyNTMgMTMuNjc1MiAwLjMyNDc2WiIgZmlsbD0iIzQzQjAyQSIvPgo8L3N2Zz4K")
    0 50% no-repeat;
  padding-left: 28px;
  margin-top: 0.5rem;
}
.dialog::v-deep .stitle-icon {
  padding-left: 24px;
  margin-top: 1rem;
}
.n-v-policy_options {
  margin-top: 0.5rem;
}
.n-v-policy::v-deep .dropdown-wrapper .header {
  display: inline-block;
}
.n-v-policy::v-deep .dropdown-wrapper > span + div {
  margin-left: 4px;
}
.n-v-policy::v-deep .dropdown-wrapper .header span {
  color: var(--lgreen, #43b02a);
  font-weight: 600;
  padding-right: 24px;
}
.n-v-policy::v-deep .dropdown-wrapper > span {
  display: inline-block;
}
.dialog::v-deep .dialog-main {
  overflow: auto;
  max-height: 60vh;
  font-size: 0.875rem;
  line-height: 23px;
}
.dialog::v-deep .dialog-title {
  font-size: 1.125rem;
  font-weight: 700;
  padding-bottom: 0;
}
.n-v-policy_btn {
  text-align: center;
  margin-top: 1.125rem;
}
.n-v-policy-nf {
  color: var(--lgreen, #43b02a);
  font-weight: 600;
}
</style>
