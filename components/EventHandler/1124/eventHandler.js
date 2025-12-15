import { findField } from "@/components/EventHandler/helpers";

const setRegion = (field, region) => {
  const currentRegion = field.options?.find((item) => item.value === Number(region));

  if (currentRegion && !field.value) {
    field.value = region;
  }
};

export function eventHandler(data) {
  return data;
}

export function initHandler(data) {
  const regionId = document.cookie.match(/(?:^|; )kladr_id=([^;]*)/)?.[1]?.slice(0, -11);
  const region = findField(data, "IDPHOLDER_REGION");
  const newCard = this.$store?.state?.card?.cardId === 0;

  if (regionId !== undefined && region && newCard) {
    setRegion(region, regionId);
  }

  return data;
}
