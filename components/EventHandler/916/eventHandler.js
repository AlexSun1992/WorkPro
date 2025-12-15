export function eventHandler(data, item, action) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  const AUTOANSWER = data.find((f) => f.name === "AUTOANSWER");
  const FIELD_BUTTON_CHANGE = data.find((f) => f.name === "Item37652");
  const FIELD_BUTTON_CHANGE_2 = data.find((f) => f.name === "Item37651");
  const SFIO = data.find((f) => f.name === "SFIO");
  const SPHONE = data.find((f) => f.name === "SPHONE");
  const SEMAIL = data.find((f) => f.name === "SEMAIL");
  const IDRMCALLBACKTYPE = data.find((f) => f.name === "IDRMCALLBACKTYPE");
  const SMESSAGE = data.find((f) => f.name === "SMESSAGE");
  const BACCEPT = data.find((f) => f.name === "BACCEPT");

  if (field.name === "IDRMCALLBACKTYPE" && field.value === "21") {
    SFIO.visible = false;
    SPHONE.visible = false;
    SEMAIL.visible = false;
    IDRMCALLBACKTYPE.readonly = true;
    SMESSAGE.visible = false;
    BACCEPT.visible = false;
    AUTOANSWER.visible = true;
    AUTOANSWER.readonly = true;
    FIELD_BUTTON_CHANGE.visible = true;
    FIELD_BUTTON_CHANGE_2.visible = false;
  }

  if (field.name === "Item37651" && action === "afterSave") {
    SFIO.readonly = true;
    SPHONE.readonly = true;
    SEMAIL.readonly = true;
    IDRMCALLBACKTYPE.readonly = true;
    SMESSAGE.readonly = true;
    BACCEPT.visible = false;
    AUTOANSWER.visible = true;
    AUTOANSWER.readonly = true;
    FIELD_BUTTON_CHANGE.visible = true;
    FIELD_BUTTON_CHANGE_2.visible = false;
  }

  return data;
}
