import { ref, computed, watch } from "vue";
import {
  isGenderReveal,
  userGender,
  getSuggestions,
  isEnoughDataForGenderDefine,
  isFieldFIONotValid,
  // eslint-disable-next-line import/extensions
} from "@/components/Login/RegForm/dadata.helper";

export const formatDateObject = (dateString) => {
  if (!dateString) return "";
  return dateString.split(".")[0];
};
export const updateField = (fieldName, event, invalidRef, dirtyRef, handleBlur, updateFields) => {
  invalidRef.value = !event;
  dirtyRef.value = true;
  handleBlur?.(fieldName, event);
  updateFields?.(fieldName, event);
};

export const createFieldState = (initialValue = "") => ({
  value: initialValue,
  isHaveNotErrorMessage: true,
  isTouch: false,
  isHaveNotValidSignsErrorMessage: true,
  type: "",
  policyClassHub: [],
});

export const initializeField = (userValue, autocompleteRef, stateRef) => {
  if (userValue && autocompleteRef?.value) {
    autocompleteRef.value.value = userValue;
    updateFieldState(stateRef.value, userValue);
  }
};
export const handleFIOBlur = (fieldState) => {
  if (fieldState.value === "") {
    fieldState.isHaveNotErrorMessage = false;
    fieldState.isTouch = true;
  }
};

export const validateFIOInput = (value) => {
  const regex = /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;
  return isFieldFIONotValid(value, regex);
};

export const updateFieldState = (fieldState, value, isTouch = true) => {
  const isInputNotValid = validateFIOInput(value);
  fieldState.value = value;
  if (isTouch) fieldState.isTouch = true;
  if (value === "") {
    fieldState.isHaveNotErrorMessage = false;
    fieldState.isHaveNotValidSignsErrorMessage = true;
  } else if (!isInputNotValid) {
    fieldState.isHaveNotErrorMessage = true;
    fieldState.isHaveNotValidSignsErrorMessage = true;
  } else {
    fieldState.isHaveNotErrorMessage = true;
    fieldState.isHaveNotValidSignsErrorMessage = false;
  }
};

export function useFIOSuggestions(surnameState, nameState, patronymicState, suggestionsHub) {
  const gender = ref("UNKNOWN");

  const isGenderRevealed = computed(() =>
    isGenderReveal(surnameState.value.value, nameState.value.value, patronymicState.value.value)
  );

  const isGenderDefine = computed(() =>
    isEnoughDataForGenderDefine(nameState.value.value, patronymicState.value.value)
  );

  const updateGenderFromFields = () => {
    const fields = [
      { value: surnameState.value.value },
      { value: nameState.value.value },
      { value: patronymicState.value.value },
    ];
    for (const field of fields) {
      const fieldGender = userGender(suggestionsHub.value, field.value);
      if (fieldGender !== undefined) {
        gender.value = fieldGender;
        break;
      }
    }
  };

  const createFIOGetter = (fieldState, fetchFunction) => async (input) => {
    suggestionsHub.value = [];

    if (input?.length > 0) {
      if (input.charAt(0) === " ") {
        input = "";
        fieldState.value = "";
        fieldState.isHaveNotErrorMessage = false;
        fieldState.isHaveNotValidSignsErrorMessage = true;
        fieldState.isTouch = true;
        return [];
      }

      const isInputNotValid = isFieldFIONotValid(input, /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/);

      if (!isInputNotValid) {
        fieldState.value = input;
        fieldState.isHaveNotErrorMessage = true;
        fieldState.isHaveNotValidSignsErrorMessage = true;
        fieldState.isTouch = true;
      } else {
        fieldState.isHaveNotErrorMessage = true;
        fieldState.isTouch = true;
        fieldState.isHaveNotValidSignsErrorMessage = false;
      }
    }

    if (fieldState.isTouch && input === "") {
      fieldState.value = "";
      fieldState.isHaveNotErrorMessage = false;
      fieldState.isHaveNotValidSignsErrorMessage = true;
      suggestionsHub.value = [];
    }

    if (!isGenderRevealed.value || !isGenderDefine.value) {
      gender.value = "UNKNOWN";
    }

    if (input && input.length > 0) {
      const data = await fetchFunction(
        input,
        gender.value,
        isFieldFIONotValid(input, /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/)
      );
      return getSuggestions(data, suggestionsHub.value, fieldState.value);
    }
    return [];
  };

  watch([() => nameState.value?.value, () => patronymicState.value?.value], () => {
    if (!isGenderRevealed.value || !isGenderDefine.value) {
      gender.value = "UNKNOWN";
    }
  });

  return {
    gender,
    isGenderRevealed,
    isGenderDefine,
    updateGenderFromFields,
    createFIOGetter,
  };
}
