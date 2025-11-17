<template>
  <div class="n-v-policy">
    <div
      :id="data.fieldId"
      :class="getPresetsClass(index, getPolicyCardOptions.ID)"
      @click.stop="updateField(getPolicyCardOptions.ID)"
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
          :class="index > 0 ? 'mt-2' : ''"
        >
          <InsuredBoxField
            :policyOption="policyOption"
            :tooltip="tooltipData[index]"
            :tooltipKey="`${getPolicyCardOptions.ID}${index}`"
          />
        </div>
      </div>
      <div
        v-if="getPolicyCardOptions.NCOST"
        ref="button"
        class="box-button"
      >
        <div>
          <span
            v-if="getPolicyCardOptions.NDISCOUNT"
            class="text-nowrap box-price"
            >{{ getPolicyCardOptions.NDISCOUNT }} ₽</span
          >
          <span class="text-nowrap box-price">{{ getPolicyCardOptions.NCOST }} ₽</span>
        </div>
      </div>
      <div class="n-v-policy_btn">
        <button
          v-if="getPolicyCardOptions.SDOWNLOAD"
          class="btn-outline-black size-m"
          @click.stop="downloadFile(getPolicyCardOptions.SDOWNLOAD)"
        >
          {{ getPolicyCardOptions.SLOADTEXT }}
        </button>

        <button
          v-if="modalData && getPolicyCardOptions.SDETAILS_TITLE"
          @click.stop="openModal()"
          class="btn-outline-black size-m"
        >
          {{ getPolicyCardOptions.SDETAILS_TITLE }}
        </button>
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
          <div>
            <div class="dialog-title">
              {{ getPolicyCardOptions.SNAME }}
            </div>
            <div
              v-for="elem in modalData"
              :key="elem.sdescription"
            >
              <div
                class="stitle-icon"
                v-if="elem.stitle"
              >
                <strong>{{ elem.stitle }}</strong>
              </div>
              <div
                class="px-3 mt-2"
                v-if="elem.sdescription"
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
import InsuredBoxField from "./InsuredBoxField.vue";
import { formattedNumber } from "./formattedNumber";
import ControlModal from "@/components/Libs/Controls/AsyncModalAction/ControlModal";
import { saveFileAxios } from "@/utils/saveFile";

export default {
  name: "ControlInsuredBoxCard",
  components: { InsuredBoxField, ControlModal },
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
    val: {
      type: [Number, Boolean],
      default: null,
    },
    isCreated: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { updatedCardNumber: null, isClicked: false };
  },
  created() {
    if (this.getData?.length > 3) {
      this.settings.centerMode = true;
    }
    this.componentRender(true);
  },
  computed: {
    modalData() {
      try {
        return JSON.parse(this.getPolicyCardOptions.SDETAILS);
      } catch (error) {
        return this.getPolicyCardOptions.SDETAILS;
      }
    },
    getPolicyCardOptions() {
      return this.data.options[this.index + 1];
    },
    isLabel() {
      return Boolean(this.getPolicyCardOptions?.SLABEL);
    },

    isActive() {
      const id = Number(this.getPolicyCardOptions.ID);
      const nActive = Number(this.getPolicyCardOptions.NACTIVE);
      const value = Number(this.data.value);
      const isValNumber = typeof this.val === "number";

      if (this.isCreated) {
        if (!isValNumber) {
          if (nActive === id) {
            this.updatePolicyValue(id);
          }
          return nActive === id || value === id;
        }

        if (isValNumber) {
          if (nActive === id) {
            this.componentRender(false);
            this.updatePolicyValue(id);
            return nActive === id;
          }
          if (value === id) {
            this.updatePolicyValue(id);
            this.componentRender(false);
            return value === id;
          }
        }
      }

      if (!this.isCreated) {
        if (this.isClicked === false) {
          this.isClicked = true;
        }

        return isValNumber ? value === id : nActive === id || value === id;
      }

      return Number(this.data.value) === Number(this.getPolicyCardOptions.ID);
    },
  },

  methods: {
    openModal() {
      this.$refs.modal.openModal();
    },
    closeModal() {
      this.$refs?.modal?.closeModal(true);
    },
    updatePolicyValue(id) {
      const updateData = {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: Number(id),
      };
      this.$emit("update", updateData);
    },
    componentRender(el) {
      this.$emit("isRendered", el);
    },
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
      this.isClicked = true;
      this.componentRender(false);
      this.$emit("update", updateData);
    },

    getPresetsClass(index, el) {
      const even = index % 2 === 0;
      if (this.isActive) {
        this.updatedCardNumber = el;
      }
      return {
        box: true,
        sale_btn: this.getPolicyCardOptions.NDISCOUNT && this.getPolicyCardOptions.NCOST,
        active: this.isActive,
      };
    },
  },
};
</script>
<style scoped>
.box {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 59px auto min-content minmax(0, max-content);
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background-color: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 30px 20px;
  position: relative;
  cursor: pointer;
  height: 100%;
}
.sale_btn.box {
  grid-template-rows: 49px auto 80px;
}

.box-title {
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  border-bottom: 1px solid #c3c3c3;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--black);
  position: relative;
  padding-right: 34px;
}
.box-title::after {
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
.box-title::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  height: 10px;
}
.box.active .box-title::after {
  border: 10px solid var(--lgreen);
}

.box-description {
  margin-top: 1.5rem;
}
.box-button {
  padding: 0;
  border-radius: 15px;
  margin-top: 1.25rem;
}

.box.active {
  border-color: var(--lgreen);
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
}

.box-flag {
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
.box-price {
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.5rem;
  text-align: center;
  display: block;
  color: var(--lgreen);
  font-feature-settings: "pnum" on, "lnum" on;
}
.box-price + .box-price {
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: var(--warmgrey_40);
  text-decoration: line-through;
}
.n-v-policy_btn {
  text-align: center;
  margin-top: 1.125rem;
}

.n-v-policy::v-deep .stitle-icon,
.n-v-policy_options > div {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42NzUyIDAuMzI0NzZDMTQuMTA4MyAwLjc1Nzc3MyAxNC4xMDgzIDEuNDU5ODMgMTMuNjc1MiAxLjg5Mjg0TDUuNTY2NDQgMTAuMDAxNkM1LjEzMzQzIDEwLjQzNDcgNC40MzEzNyAxMC40MzQ3IDMuOTk4MzYgMTAuMDAxNkwwLjMyNDc2IDYuMzI4MDRDLTAuMTA4MjUzIDUuODk1MDMgLTAuMTA4MjUzIDUuMTkyOTcgMC4zMjQ3NiA0Ljc1OTk2QzAuNzU3NzczIDQuMzI2OTUgMS40NTk4MyA0LjMyNjk1IDEuODkyODQgNC43NTk5Nkw0Ljc4MjQgNy42NDk1MkwxMi4xMDcyIDAuMzI0NzZDMTIuNTQwMiAtMC4xMDgyNTMgMTMuMjQyMiAtMC4xMDgyNTMgMTMuNjc1MiAwLjMyNDc2WiIgZmlsbD0iIzQzQjAyQSIvPgo8L3N2Zz4K")
    0 50% no-repeat;
  padding-left: 28px;
  margin-top: 0.5rem;
}
.n-v-policy::v-deep .stitle-icon {
  padding-left: 24px;
  margin-top: 1rem;
}
.n-v-policy_options {
  margin-top: 0.5rem;
}
.n-v-policy::v-deep .dropdown-wrapper .header {
  display: inline-block;
}
.n-v-policy::v-deep .dropdown-wrapper .header span {
  color: var(--lgreen, #43b02a);
  font-weight: 600;
  padding-right: 24px;
}
.n-v-policy::v-deep .dropdown-wrapper > span {
  display: inline-block;
}
.n-v-policy::v-deep dialog {
  max-height: 80vh;
  overflow: hidden;
}
.n-v-policy::v-deep .dialog-main {
  overflow: auto;
  max-height: 60vh;
  font-size: 0.875rem;
  line-height: 23px;
}
.n-v-policy::v-deep .dialog-main .dialog-title {
  font-size: 1.125rem;
  font-weight: 700;
}
</style>
