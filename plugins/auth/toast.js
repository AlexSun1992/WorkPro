import { getErrorMessage } from "./toast.helper";

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

  console.log("errorText", errorText);

  $nuxt.$bvToast.toast(errorText, {
    id: toastCount,
    title: "Ошибка",
    variant: "danger",
    autoHideDelay: 20000,
    appendToast: false,
    toaster: "b-toaster-top-full",
  });

  // else
  //   $nuxt.$bvToast.toast(error.MESSAGE, {
  //     id: toastCount,
  //     title: "Ошибка",
  //     variant: "danger",
  //     autoHideDelay: 20000,
  //     appendToast: false,
  //     toaster: "b-toaster-top-full",
  //   });
}
