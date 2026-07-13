<template>
  <form-group
    :label="label"
    :label-for="data.name"
  >
    <textarea
      :id="data.name"
      :value="fieldValue"
      :maxlength="data.nSize || DEFAULT_COUNT"
      :disabled="!edit ? !edit : data.readonly"
      :class="[data.state === false && 'is-invalid', data.state === true && 'is-valid']"
      placeholder="Введите текст"
      :rows="3"
      @input="handleInput"
      @blur="handleBlur"
    />
    <template #label>
      <span v-html="data.label" />
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
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <div
      v-if="data.nSize"
      class="row"
    >
      <div
        v-if="data.state === false"
        class="col-md-10 col-8 invalid-feedback"
      >
        Обязательно для заполнения
      </div>
      <div
        v-if="data.nSize"
        :class="['col-md-2 col-4 number-count', data.state === false ? 'text-end' : '']"
      >
        {{ fieldValue ? fieldValue.length : 0 }} из {{ data.nSize }}
      </div>
    </div>

    <div
      v-if="data.state === false && !data.nSize"
      class="invalid-feedback"
    >
      Обязательно для заполнения
    </div>
  </form-group>
</template>

<script>
import { computed, watch, ref } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

const DEFAULT_COUNT = 4000;
export default {
  name: "ControlText",
  components: { FormGroup },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const label = computed(() => props.data.label);
    const fieldValue = computed(() => props.data.value);

    const handleBlur = (e) => {
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: e.target.value.trim(),
      });
    };

    const handleInput = (event) => {
      const newValue = event.target.value;
      const maxLength = props.data?.nSize || DEFAULT_COUNT;
      if (newValue.length <= maxLength) {
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: newValue,
        });
      }
    };

    return { label, fieldValue, handleInput, handleBlur };
  },
};
</script>

<style scoped>
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
.number-count {
  font-size: 0.75rem;
  color: var(--warmgrey_80, #868686);
}
</style>
