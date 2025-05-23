export function eventHandler(fields, action) {
  const questionAboutDMS = fields.find((f) => f.name === "SDMS");
  const region = fields.find((f) => f.name === "SREGION");
  const chooseFKSInsuredPerson = fields.find((f) => f.name === "FKSINSURED");

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

  return fields;
}
