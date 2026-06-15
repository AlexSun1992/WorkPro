<template>
  <div>
    <div class="checkbox-hide">
      <input
        :id="elementId"
        v-model="fieldValue"
        type="checkbox"
        :disabled="!edit ? !edit : data.readonly"
        class="custom-control-input"
      />
      <label
        :for="elementId"
        class="custom-control-label"
      >
        <span v-html="data.label"></span>
        <span
          v-if="data.helpText"
          class="position-relative"
        >
          <span class="tooltipster"
            >(?)
            <vue-easy-tooltip
              :with-arrow="false"
              position="top"
              :offset="4"
            >
              <span v-html="data.helpText"></span>
            </vue-easy-tooltip>
          </span>
        </span>
      </label>

      <div
        v-if="data.state === false || !isRequiredPersonalDataCheckBox"
        class="custom-invalid-feedback"
      >
        Необходимо указать этот параметр
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted } from "vue";

export default {
  name: "ControlBoolean",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update"],
  setup(props, { emit, attrs }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;

    const parseValue = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    const ns = computed(() => props.params?.ns || "data_card");

    const elementId = computed(() => {
      const oneTwoManyIndex = attrs.oneToManyData?.index || "";
      const id = String(props.data.webId || props.data.fieldId) || "control-boolean";

      return oneTwoManyIndex ? `${id}-${oneTwoManyIndex}` : id;
    });

    const isRequiredPersonalDataCheckBox = computed(() => {
      const getSavedError = store.getters[`${ns.value}/getSavedError`];
      const requiredCheckBox = props.data.required === true;

      if (requiredCheckBox && getSavedError) {
        if (props.data.value === false && props.data.checked === true && props.data.state === true) {
          return false;
        }
      }

      return true;
    });

    const fieldValue = computed({
      get: () => {
        if (props.data.structType === "boolrus") {
          return props.data.value === "Д" || props.data.value === true;
        }

        return props.data.value === "Y" || props.data.value === true;
      },
      set: (value) => {
        const newValue = props.data.required === true && value === false ? undefined : value;

        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: newValue,
        });
      },
    });

    onMounted(() => {
      document.querySelectorAll(".checkbox-hide > label").forEach((elm) =>
        elm.addEventListener("click", (e) => {
          if (e.target.className === "tooltipster") {
            e.preventDefault();
          }
        })
      );

      store.commit(`${ns.value}/setFormField`, {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: parseValue(props.data.value),
      });
    });

    return { elementId, isRequiredPersonalDataCheckBox, fieldValue };
  },
};
</script>

<style scoped>
.custom-invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #dc3545;
  text-align: left;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans",
    sans-serif;
}
</style>
