export function eventHandler(data, action) {
  const questionAboutDMS = data.find((f) => f.name === "SDMS");
  const region = data.find((f) => f.name === "SREGION");
  const chooseFKSInsuredPerson = data.find((f) => f.name === "FKSINSURED");

  if (action.name === "STOPIC" && action.value === "21") {
    region.visible = true;
    chooseFKSInsuredPerson.visible = true;
    questionAboutDMS.visible = true;
  }

  if (action.name === "STOPIC" && action.value !== "21") {
    region.visible = false;
    chooseFKSInsuredPerson.visible = false;
    questionAboutDMS.visible = false;
  }

  return data;
}
