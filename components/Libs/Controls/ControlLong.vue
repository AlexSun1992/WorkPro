<template>
  <form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label"></span>
      <span
        v-if="data.helpText"
        class="position-relative"
      >
        &nbsp;
        <span class="tooltipster">
          (?)
          <vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText"></span>
          </vue-easy-tooltip>
        </span>
      </span>
    </template>
    <b-form-input
      :id="data.name"
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      type="number"
      :state="data.state"
      :min="0"
      oninput="validity.valid||(value='')"
    ></b-form-input>
    <div
      v-if="data.state === false"
      class="invalid-feedback"
    >
      Обязательно для заполнения
    </div>
  </form-group>
</template>

<script>
import { computed } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlLong",
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
    const fieldValue = computed({
      get() {
        return props.data.value;
      },
      set(value) {
        emit("update", { fieldId: props.data.fieldId, value });
      },
    });

    return {
      fieldValue,
    };
  },
};
</script>
