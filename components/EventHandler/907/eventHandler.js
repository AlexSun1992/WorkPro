export function eventHandler(data, item, action) {
  if (action === "displayText") {
    if (data.name === "FKSPOLICY") {
      return `${item.SNAME}`;
    }
  }
  const policy = data.find((f) => f.name === "FKSPOLICY");
  const pacient = data.find((f) => f.name === "SFIO");
  const date = data.find((f) => f.name === "DDATE");
  const contactFIO = data.find((f) => f.name === "SKONTFIO");
  const phone = data.find((f) => f.name === "SPHONE");
  const occasion = data.find((f) => f.name === "SOCCASION");
  const covidBlock = data.find((f) => f.name === "SCOVIDBLOCKSPLITTER");
  const checkCovid19 = data.find((f) => f.name === "BCHECKCOVID19");
  const dateOfTest = data.find((f) => f.name === "SDATEOFTEST");
  const testResult = data.find((f) => f.name === "FKSTESTRESULT");
  const contactCovid19 = data.find((f) => f.name === "BCONTACTCOVID19");
  const dateOfContact = data.find((f) => f.name === "SDATEOFCONTACT");
  const vaxCovid19 = data.find((f) => f.name === "BVAXCOVID19");
  const addressBlock = data.find((f) => f.name === "SADDRESSBLOCKSPLITTER");
  const address = data.find((f) => f.name === "SFULLPHOLDER_ADDRESS");
  const entrance = data.find((f) => f.name === "SENTRANCE");
  const floor = data.find((f) => f.name === "SFLOOR");
  const intercom = data.find((f) => f.name === "SINTERCOM");
  const comment = data.find((f) => f.name === "SCOMMENT");
  const temp = data.find((f) => f.name === "STEMP");
  const make_button = data.find((f) => f.name === "Item37199");

  if (item.name === "FKSPOLICY") {
    if (pacient) {
      pacient.value = `${item.value.value["SNAME"]}`;
      pacient.visible = true;
    }
    date.value = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, ".")
      .split(".")
      .reverse()
      .join(".");
    date.visible = true;
    contactFIO.value = `${item.value.value["SNAME"]}`;
    contactFIO.visible = true;
    phone.value = item.value.value["SPHONE"];
    phone.visible = true;
    occasion.visible = true;
    covidBlock.visible = true;
    checkCovid19.visible = true;
    contactCovid19.visible = true;
    vaxCovid19.visible = true;
    addressBlock.visible = true;
    address.visible = true;
    entrance.visible = true;
    floor.visible = true;
    intercom.visible = true;
    comment.visible = true;
    make_button.visible = true;
    policy.visible = false;
    temp.visible = true;
  }
  if (item.name === "BCHECKCOVID19") {
    if (item.value === true) {
      dateOfTest.value = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, ".")
        .split(".")
        .reverse()
        .join(".");
      dateOfTest.visible = true;
      testResult.visible = true;
    } else {
      dateOfTest.visible = false;
      testResult.visible = false;
    }
  }

  if (item.name === "BCONTACTCOVID19") {
    if (item.value === true) {
      dateOfContact.value = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, ".")
        .split(".")
        .reverse()
        .join(".");
      dateOfContact.visible = true;
    } else {
      dateOfContact.visible = false;
    }
  }
  return data;
}

// export { eventHandler };
