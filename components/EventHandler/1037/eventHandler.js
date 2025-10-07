export async function eventHandler(data, item, callback) {
  data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
  const field = data.find((f) => f.fieldId === item.fieldId);
  //check = data.find(({ name }) => name === "SCHECKER");
  //check.value = 'Y';

  const SREGNUM = data.find(({ name }) => name === "SREGNUM");

  const IDVEHICLEPOLICY = data.find(({ name }) => name === "IDVEHICLE_POLICY");

  if (item.name === "IDVEHICLE_POLICY") {
    console.log(SREGNUM, "SREGNUM");
    IDVEHICLEPOLICY.value = item.value;
    SREGNUM.value = null;
  }
  if (
    item.name === "SREGNUM" &&
    SREGNUM.value !== "" &&
    SREGNUM.value !== "N" &&
    (SREGNUM.value?.length === 8 || SREGNUM.value?.length === 9)
  ) {
    IDVEHICLEPOLICY.value = null;
    SREGNUM.value = item.value;
  }

  const IDVEHICLE_CASCO = data.find(({ name }) => name === "IDVEHICLE_CASCO");
  const NLASTPOLICY_RESO = data.find((f) => f.name === "NLASTPOLICY_RESO");

  if (item.name === "NLASTPOLICY_RESO") {
    if (item.value === "") {
      NLASTPOLICY_RESO.state = null;
      NLASTPOLICY_RESO.error = null;
    }
  }

  // const IDBRAND = data.find(({ name }) => name === "IDBRAND");
  // const IDMODEL = data.find(({ name }) => name === "IDMODEL");

  // if (item.name === "IDBRAND") {
  // if (!IDBRAND.value) {
  //IDMODEL.visible = true;
  // }
  // if (IDBRAND.value) {
  // IDMODEL.visible = true;
  // }
  // }

  // Поля в случае, когда есть полис в РЕСО
  const fieldBPREVPOLICY = data.find(({ name }) => name === "BPREVPOLICY");
  const fieldIVEHICLECASCO = data.find(({ name }) => name === "IDVEHICLE_CASCO");
  const fieldSCHOOSELASTPOLICY = data.find(({ name }) => name === "SCHOOSELASTPOLICY");

  if (fieldBPREVPOLICY.value == 2) {
    IDVEHICLE_CASCO.visible = true;

    if (
      IDVEHICLE_CASCO?.value === 1 ||
      (IDVEHICLE_CASCO.options?.length === 1 && IDVEHICLE_CASCO.options[0].value === 1)
    ) {
      IDVEHICLE_CASCO.visible = IDVEHICLE_CASCO.options?.length > 1;
      NLASTPOLICY_RESO.visible = true;
    } else {
      NLASTPOLICY_RESO.value = "";
      NLASTPOLICY_RESO.visible = false;
      NLASTPOLICY_RESO.state = null;
      NLASTPOLICY_RESO.error = null;
    }
    data.find((f) => f.name === "SREGNUMTITLE").visible = false;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = false;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = false;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = true;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SLASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = false;
    data.find((f) => f.name === "Continue").visible = false;
    data.find((f) => f.name === "Item47371").visible = true;

    if (!fieldIVEHICLECASCO.options || fieldIVEHICLECASCO.options?.length === 0) {
      fieldSCHOOSELASTPOLICY.visible = false;
    }
  }

  if (fieldBPREVPOLICY.value == 3) {
    data.find((f) => f.name === "SREGNUMTITLE").visible = false;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = false;
    data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = true;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = true;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY_RESO").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SLASTPOLICY").visible = true;
    data.find((f) => f.name === "SREGNUM").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = true;
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47371").visible = false;
  }

  if (fieldBPREVPOLICY.value == 1) {
    data.find((f) => f.name === "SREGNUMTITLE").visible = true;
    data.find((f) => f.name === "IDVEHICLE_POLICY").visible = true;
    data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
    data.find((f) => f.name === "SREGNUM").visible = true;
    data.find((f) => f.name === "SLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY").visible = false;
    data.find((f) => f.name === "NLASTPOLICY_RESO").visible = false;
    data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = false;
    data.find((f) => f.name === "DTO_DATE_LAST").visible = false;
    data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = false;
    data.find((f) => f.name === "SREGNUM_OTHER").visible = false;
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47371").visible = false;
    //IDVEHICLE_CASCO.value = "";
    //NLASTPOLICY_RESO.value = "";
    //data.find((f) => f.name === "ID").value = null;
    //IDVEHICLEPOLICY.value = null;
  }

  return data;
}

// function initHandler(data) {
// const IDBRAND = data.find(({ name }) => name === "IDBRAND");
// const IDMODEL = data.find((f) => f.name === "IDMODEL");

// const IDVEHICLE_CASCO = data.find(({ name }) => name === "IDVEHICLE_CASCO");
// const SAUTOCASCO = data.find((f) => f.name === "SAUTOCASCO");

// if (IDBRAND.value > 0) {
//IDMODEL.visible = true;
//}

//if (!IDVEHICLE_CASCO.value) {
// IDVEHICLE_CASCO.visible = false;
//   SAUTOCASCO.visible = false;
// }
// return data;
// }

export function initHandler(data) {
  console.log(
    data.find((f) => f.name === "SCHOOSELASTPOLICY"),
    "----"
  );
  const fieldBPREVPOLICY = data.find(({ name }) => name === "BPREVPOLICY");
  const lastpolicy_reso = data.find((f) => f.name === "NLASTPOLICY_RESO");
  //const regnum = data.find((f) => f.name === "SREGNUM");
  //check = data.find(({ name }) => name === "SCHECKER");
  //check.value = 'N';

  if (lastpolicy_reso.value) {
    lastpolicy_reso.state = true;
    lastpolicy_reso.error = null;
  }

  if (fieldBPREVPOLICY.value == 1) {
    //data.find((f) => f.name === "SREGNUMTITLE").visible = true;
    //data.find((f) => f.name === "IDVEHICLE_POLICY").visible = true;
    //data.find((f) => f.name === "IDVEHICLE_CASCO").visible = false;
    //data.find((f) => f.name === "SREGNUM").visible = true;
    //data.find((f) => f.name === "SLASTPOLICY").visible = false;
    //data.find((f) => f.name === "NLASTPOLICY").visible = false;
    //data.find((f) => f.name === "NLASTPOLICY_RESO").visible = false;
    //data.find((f) => f.name === "IDCURRENT_INSURANCE").visible = false;
    //data.find((f) => f.name === "DTO_DATE_LAST").visible = false;
    //data.find((f) => f.name === "SCHOOSELASTPOLICY").visible = false;
    //data.find((f) => f.name === "SREGNUM_OTHER").visible = false;
    data.find((f) => f.name === "Continue").visible = true;
    data.find((f) => f.name === "Item47371").visible = false;
    //IDVEHICLE_CASCO.value = "";
    //NLASTPOLICY_RESO.value = "";
    //data.find((f) => f.name === "ID").value = null;
    //IDVEHICLEPOLICY.value = null;
  }

  //if (regnum.value) {
  //regnum.state = true;
  //regnum.error = null;
  //}
  // console.log(data.find((f) => f.name === "SCHOOSELASTPOLICY"), '+++++')

  return data;
}
