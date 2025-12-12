import { findField } from "@/components/EventHandler/helpers";

export function eventHandler(data) {
  const field = data.find((f) => f.label === "Код подтверждения");
  if (field) {
    const SCODEFIELD = findField(data, "SCODEFIELD");
    if (SCODEFIELD) {
      SCODEFIELD.visible = true;
    }
  }
  return data;
}
