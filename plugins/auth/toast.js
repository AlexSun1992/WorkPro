import { getErrorMessage } from "@/utils/transform";

let toastCount = 0;

export function makeToast(error) {
  toastCount += 1;

  if (!error) {
    throw new Error("Ошибка");
  }

  if (toastCount > 2) {
    $nuxt.$bvToast.hide(toastCount - 2);
  }

  const getErrObj = getErrorMessage(error, this.$createElement);

  $nuxt.$bvToast.toast(getErrObj, {
    id: toastCount.toString(),
    title: "Ошибка",
    variant: "danger",
    autoHideDelay: 20000,
    appendToast: false,
    toaster: "b-toaster-top-full",
  });
}
