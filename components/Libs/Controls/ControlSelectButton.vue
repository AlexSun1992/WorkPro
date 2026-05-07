<template>
  <form-group
    v-if="data.options && data.options !== undefined && data.options.length !== 0"
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label
      ><span v-html="data.label"></span>
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>
    <div>
      <button
        v-for="button in buttons"
        :key="button.ID"
        :class="{ selected: selectedButtonId === button.ID }"
        @click="selectButton(button.ID)"
        type="button"
      >
        {{ button.SNAME }}
      </button>
    </div>
  </form-group>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlSelectButtons",
  components: { FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  computed: {
    selectedButtonId() {
      return this.data.value;
    },
    buttons() {
      return this.data.options;
    },
  },
  methods: {
    selectButton(id) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value: this.selectedButtonId !== id ? id : null,
      });
    },
  },
};
</script>
<style scoped>
button {
  background-color: #edf8ea;
  border-radius: 38px;
  height: 38px;
  color: #292929;
  border: 0;
  padding: 4px 12px;
  font-size: 1.125rem;
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
}
button:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}
.selected {
  background: #009639;
  color: #fff;
}
</style>
