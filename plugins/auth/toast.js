import {
  getErrorMessage,
  isORAexist,
  convertErrorMessageToArray,
} from "./toast.helper";

let toastCount = 0;

export function makeToast(error) {
  toastCount += 1;

  if (!error) {
    throw new Error("Ошибка");
  }

  if (toastCount > 2) {
    $nuxt.$bvToast.hide(toastCount - 2);
  }

  const errorText = getErrorMessage(error.MESSAGE);
  const errorTextWithoutSymbols = errorText?.replace(/[^a-zа-яё0-9\s]/gi, " ");
  const getArrFromErrorText = convertErrorMessageToArray(error.MESSAGE);
  const isORAinErrorText = isORAexist(getArrFromErrorText);

  if (isORAinErrorText) {
    $nuxt.$bvToast.toast(errorTextWithoutSymbols, {
      id: toastCount,
      title: "Ошибка",
      variant: "danger",
      autoHideDelay: 20000,
      appendToast: false,
      toaster: "b-toaster-top-full",
    });
  } else
    $nuxt.$bvToast.toast(error.MESSAGE, {
      id: toastCount,
      title: "Ошибка",
      variant: "danger",
      autoHideDelay: 20000,
      appendToast: false,
      toaster: "b-toaster-top-full",
    });
}
