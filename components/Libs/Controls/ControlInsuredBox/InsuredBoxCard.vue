<template>
  <div>
    <div
      :class="getPresetsClass(index)"
      @click="updateField(getPolicyCardOptions.ID)"
    >
      <div class="box-title">{{ getPolicyCardOptions.SNAME }}</div>
      <div class="box-description">
        <div v-for="(policyOption, index) in card" :key="index">
          <InsuredBoxField :policyOption="policyOption" />
        </div>
      </div>
      <div ref="button" class="box-button">
        {{ formattedNum(getPolicyCardOptions.NCOST) }} &#8381;
      </div>
    </div>
  </div>
</template>

<script>
import InsuredBoxField from "./InsuredBoxField.vue";
import { formattedNumber } from "./formattedNumber";

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
  },
  methods: {
    formattedNum(obj) {
      return !isNaN(obj) ? formattedNumber(Number(obj)) : obj;
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
        active:
          Number(this.data.value) === Number(this.getPolicyCardOptions.ID),
      };
    },
  },
};
</script>
<style scoped>
.box {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 49px auto 42px;
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background-color: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 30px 11px 28px;
  position: relative;
  cursor: pointer;
  height: 100%;
}
.box-title {
  font-family: Raleway;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  margin: 0 19px;
  border-bottom: 1px solid #c3c3c3;
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
</style>
