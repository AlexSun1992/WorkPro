import { getErrorMessage } from "../../utils/transform";

let toastCount = 0;

export function makeToast(error) {
  toastCount += 1;

  if (!error) {
    throw new Error("Ошибка");
  }

  if (toastCount > 2) {
    $nuxt.$bvToast.hide(toastCount - 2);
  }
  const revealErrorType = typeof getErrorMessage(error);
  const getErrObj = getErrorMessage(error);
  if (revealErrorType === "object") {
    const htmlElement = this.$createElement;
    const vNodesMSG = htmlElement("p", [
      htmlElement("p", { props: { type: "grow", small: true } }),
      `${getErrObj.errorText}`,
      htmlElement("b-link", { props: { href: "/" } }, `${getErrObj.errorLink}`),
    ]);

    $nuxt.$bvToast.toast(vNodesMSG, {
      id: toastCount.toString(),
      title: "Ошибка",
      variant: "danger",
      autoHideDelay: 20000,
      appendToast: false,
      toaster: "b-toaster-top-full",
    });
    return;
  }

  if (revealErrorType === "string") {
    $nuxt.$bvToast.toast(getErrorMessage(error), {
      id: toastCount.toString(),
      title: "Ошибка",
      variant: "danger",
      autoHideDelay: 20000,
      appendToast: false,
      toaster: "b-toaster-top-full",
    });
  }
}
