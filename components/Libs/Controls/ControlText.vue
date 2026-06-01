<template>
  <form-group
    :label="label"
    :label-for="data.name"
  >
    <textarea
      :id="data.name"
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :class="[data.state === false && 'is-invalid', data.state === true && 'is-valid']"
      placeholder="Введите текст"
      :rows="3"
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
      class="invalid-feedback"
      v-if="data.state === false"
    >
      Обязательно для заполнения
    </div>
  </form-group>
</template>

<script>
import { computed } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

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

    const fieldValue = computed({
      get() {
        return props.data.value;
      },
      set(value) {
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: value.trim(),
        });
      },
    });

    return { label, fieldValue };
  },
};
</script>

<style scoped>
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
