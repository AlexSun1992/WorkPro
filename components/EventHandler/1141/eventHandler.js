export function eventHandler(data, item) {
  const field = data.find((f) => f.label === "Код подтверждения");
  if(field){
    data.find((f) => f.name === "SCODEFIELD").visible = true;
    return data;
  }
  return data;
}
