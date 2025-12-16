import { scrollToCardHead } from "@/utils/scroll";

export function initHandler(data) {
  scrollToCardHead(".wizard_osago");

  return data;
}

export function eventHandler(data, item, action) {
  const actionId = 46209;

  if (action === "beforeSave") {
    this.$store.commit("data_card/setFetchingAction", {
      actionId,
      isFetching: true,
    });
    this.$store.commit("data_card/saveButtonClicked", true);
  }

  if (action === "afterSave") {
    this.$store.commit("data_card/setFetchingAction", {
      actionId,
      isFetching: false,
    });
  }
  return data;
}
