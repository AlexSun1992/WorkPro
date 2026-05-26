<template>
  <div :class="mainClass">
    <RInput
      :options="options"
      mask="##.##.####"
      label="Дата рождения"
      :type="'text'"
      :state="state"
      name="birthdate"
      :errorInputText="errorInputText"
      v-model="localValue"
      class="form-control"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import moment from "moment";
import RInput from "./RInput";

export default {
  name: "BirthdateField",
  components: {
    RInput,
  },
  props: {
    mainClass: {
      type: String,
      default: "",
    },
    validClass: {
      type: String,
      default: "",
    },
    userData: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    errorInputText: {
      type: String,
      default: "",
    },
    state: {
      type: [Boolean, null],
      default: null,
    },
  },

  emits: ["updateBirthdate"],

  setup(props, { emit }) {
    const MIN_DATE = moment("01.01.1925", "DD.MM.YYYY");
    const MAX_DATE = moment();
    const localValue = ref("");

    watch(
      () => props.userData?.birthdate,
      (newValue) => {
        if (newValue) {
          const [year, month, day] = newValue.split("-");
          localValue.value = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
        } else {
          localValue.value = "";
        }
      },
      { immediate: true }
    );

    const handleInput = (value) => {
      if (value && value.length === 10) {
        const [day, month, year] = value.split(".");
        emit("updateBirthdate", `${year}-${month}-${day}`);
      } else if (!value) {
        emit("updateBirthdate", "");
      }
    };

    const handleBlur = () => {
      if (!localValue.value || localValue.value.length < 10) {
        localValue.value = "";
        emit("updateBirthdate", "");
        return;
      }

      const date = moment(localValue.value, "DD.MM.YYYY", true);
      const year = parseInt(localValue.value.split(".")[2]);

      if (!date.isValid() || date.isBefore(MIN_DATE) || date.isAfter(MAX_DATE) || year < MIN_DATE) {
        localValue.value = "";
        emit("updateBirthdate", "");
      }
    };

    return {
      localValue,
      handleInput,
      handleBlur,
    };
  },
};
</script>
