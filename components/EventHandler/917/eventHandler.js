export function eventHandler(data, item, action) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  const IDDMS = data.find((f) => f.name === "IDDMS");
  const IDREGION = data.find((f) => f.name === "IDREGION");
  const FKIDINSURED = data.find((f) => f.name === "FKIDINSURED");
  const IDTOPIC = data.find((f) => f.name === "IDTOPIC");
  const BACCEPT = data.find((f) => f.name === "BACCEPT");
  const AUTOANSWER = data.find((f) => f.name === "AUTOANSWER");
  const FIELD_BUTTON_CHANGE = data.find((f) => f.name === "Item37654");
  const FIELD_BUTTON_CHANGE_2 = data.find((f) => f.name === "Item37653");
  const SFIO = data.find((f) => f.name === "SFIO");
  const SPHONE = data.find((f) => f.name === "SPHONE");
  const SEMAIL = data.find((f) => f.name === "SEMAIL");
  const SMESSAGE = data.find((f) => f.name === "SMESSAGE");

  if (field.name === "IDTOPIC" && field.value === "21") {
    IDREGION.visible = true;
    FKIDINSURED.visible = true;
    IDDMS.visible = true;
  }

  if (field.name === "IDTOPIC" && field.value !== "21") {
    IDREGION.visible = false;
    FKIDINSURED.visible = false;
    IDDMS.visible = false;
  }

  if (field.name === "Item37653") {
    if (action === "afterSave") {
      SFIO.readonly = true;
      SPHONE.readonly = true;
      SEMAIL.readonly = true;
      IDTOPIC.readonly = true;
      IDDMS.readonly = true;
      FKIDINSURED.readonly = true;
      IDREGION.readonly = true;
      SMESSAGE.readonly = true;
      BACCEPT.visible = false;
      AUTOANSWER.visible = true;
      AUTOANSWER.readonly = true;
      FIELD_BUTTON_CHANGE.visible = true;
      FIELD_BUTTON_CHANGE_2.visible = false;
    }
  }

  return data;
}
