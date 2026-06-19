import { findField } from "@/components/EventHandler/helpers";

const setRegion = (field, region) => {
  const currentRegion = field.options?.find((item) => item.value === Number(region));

  if (currentRegion && !field.value) {
    field.value = region;
  }
};

const lpuListDownloadBtnHandler = (data) => {
  const sdoc_file = findField(data, "SDOC_FILE");
  const iddoc_lpy = findField(data, "IDDOC_LPY");
  const isLPUFileExist = iddoc_lpy?.value === 1;

  sdoc_file.visible = isLPUFileExist;
  sdoc_file.value = isLPUFileExist ? iddoc_lpy.options[0].SNAME : null;
};

export function eventHandler(data) {
  const region = findField(data, "IDPHOLDER_REGION");
  if (region?.visible) {
    lpuListDownloadBtnHandler(data);
  }

  return data;
}

export function initHandler(data) {
  const regionId = document.cookie.match(/(?:^|; )kladr_id=([^;]*)/)?.[1]?.slice(0, -11);
  const region = findField(data, "IDPHOLDER_REGION");
  const newCard = this.$store?.state?.card?.cardId === 0;
  if (region?.visible) {
    lpuListDownloadBtnHandler(data);
  }
  if (regionId !== undefined && region && newCard) {
    setRegion(region, regionId);
  }

  return data;
}
