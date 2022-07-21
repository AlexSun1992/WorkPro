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
  const result = errorText.replace(/[^a-zа-яё0-9\s]/gi, " ");

  const getArr = convertErrorMessageToArray(error.MESSAGE);
  const isORA = isORAexist(getArr);

  if (isORA) {
    $nuxt.$bvToast.toast(result, {
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
