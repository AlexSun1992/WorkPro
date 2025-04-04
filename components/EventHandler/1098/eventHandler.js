function eventHandler(data, item, callback){

  const field = data.find((f) => f.fieldId === item.fieldId);
  const pencil_one = data.find((f) => f.name === "SURL_PERIODS");
  const stoa = data.find((f) => f.name === "IDSTOA");

  if(item.name === "SURL_PERIODS"){
    console.log('click')       ;
  }

  if (item.name === 'SURL_TECH') {
    stoa.visible = true;
    data.find((f) => f.name === "STECH_INFO").visible = false;
    data.find((f) => f.name === "SURL_TECH").visible = false;

  }
  if (stoa.visible === true) {
    if (stoa.value == 2) {
      data.find((f) => f.name === "IDLIST_STOA").visible = true;
      data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    }
    else if (stoa.value == 4) {
      data.find((f) => f.name === "IDLIST_STOA").visible = false;
      data.find((f) => f.name === "SADDRESS_STOA").visible = true;
    }
    else {
      data.find((f) => f.name === "IDLIST_STOA").visible = false;
      data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    }
  }
  if (item.name === 'SURL_ADD_DATA') {
    data.find((f) => f.name === "IDLAST_SERIES_EDIT").visible = true;
    data.find((f) => f.name === "SLAST_NUMBER_EDIT").visible = true;
    data.find((f) => f.name === "IDLAST_COMPANY_EDIT").visible = true;
    data.find((f) => f.name === "SADD_INFO_EDIT").visible = true;

    data.find((f) => f.name === "SLAST_SERIES").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER").visible = false;
    data.find((f) => f.name === "SLAST_COMPANY").visible = false;
    data.find((f) => f.name === "SADD_INFO").visible = false;

    data.find((f) => f.name === "SURL_ADD_DATA").visible = false;
  }
  if (data.find((f) => f.name === "SVEHICLE_DATA").visible === true)  {
    stoa.visible = false;
    data.find((f) => f.name === "IDLIST_STOA").visible = false;
    data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    data.find((f) => f.name === "IDLAST_SERIES_EDIT").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER_EDIT").visible = false;
    data.find((f) => f.name === "IDLAST_COMPANY_EDIT").visible = false;
    data.find((f) => f.name === "SADD_INFO_EDIT").visible = false;

    data.find((f) => f.name === "STECH_INFO").visible = false;
    data.find((f) => f.name === "SURL_TECH").visible = false;
    data.find((f) => f.name === "SLAST_SERIES").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER").visible = false;
    data.find((f) => f.name === "SLAST_COMPANY").visible = false;
    data.find((f) => f.name === "SADD_INFO").visible = false;
    data.find((f) => f.name === "SURL_ADD_DATA").visible = false;
  }

  return data
}
function eventHandler(data, item, callback){

  const field = data.find((f) => f.fieldId === item.fieldId);
  const pencil_one = data.find((f) => f.name === "SURL_PERIODS");
  const stoa = data.find((f) => f.name === "IDSTOA");

  if(item.name === "SURL_PERIODS"){
    console.log('click')       ;
  }

  if (item.name === 'SURL_TECH') {
    stoa.visible = true;
    data.find((f) => f.name === "STECH_INFO").visible = false;
    data.find((f) => f.name === "SURL_TECH").visible = false;

  }
  if (stoa.visible === true) {
    if (stoa.value == 2) {
      data.find((f) => f.name === "IDLIST_STOA").visible = true;
      data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    }
    else if (stoa.value == 4) {
      data.find((f) => f.name === "IDLIST_STOA").visible = false;
      data.find((f) => f.name === "SADDRESS_STOA").visible = true;
    }
    else {
      data.find((f) => f.name === "IDLIST_STOA").visible = false;
      data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    }
  }
  if (item.name === 'SURL_ADD_DATA') {
    data.find((f) => f.name === "IDLAST_SERIES_EDIT").visible = true;
    data.find((f) => f.name === "SLAST_NUMBER_EDIT").visible = true;
    data.find((f) => f.name === "IDLAST_COMPANY_EDIT").visible = true;
    data.find((f) => f.name === "SADD_INFO_EDIT").visible = true;

    data.find((f) => f.name === "SLAST_SERIES").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER").visible = false;
    data.find((f) => f.name === "SLAST_COMPANY").visible = false;
    data.find((f) => f.name === "SADD_INFO").visible = false;

    data.find((f) => f.name === "SURL_ADD_DATA").visible = false;
  }
  if (data.find((f) => f.name === "SVEHICLE_DATA").visible === true)  {
    stoa.visible = false;
    data.find((f) => f.name === "IDLIST_STOA").visible = false;
    data.find((f) => f.name === "SADDRESS_STOA").visible = false;
    data.find((f) => f.name === "IDLAST_SERIES_EDIT").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER_EDIT").visible = false;
    data.find((f) => f.name === "IDLAST_COMPANY_EDIT").visible = false;
    data.find((f) => f.name === "SADD_INFO_EDIT").visible = false;

    data.find((f) => f.name === "STECH_INFO").visible = false;
    data.find((f) => f.name === "SURL_TECH").visible = false;
    data.find((f) => f.name === "SLAST_SERIES").visible = false;
    data.find((f) => f.name === "SLAST_NUMBER").visible = false;
    data.find((f) => f.name === "SLAST_COMPANY").visible = false;
    data.find((f) => f.name === "SADD_INFO").visible = false;
    data.find((f) => f.name === "SURL_ADD_DATA").visible = false;
  }

  return data
}
