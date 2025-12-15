export function eventHandler(data, item) {
  if (item.value === "Item45282") {
    if (item.resp) {
      const { ID, REL } = item.resp.data[0];
      window.location.href = `/individual/auto/osago?ID=${ID}&REL=${REL}`;
      return null;
    }
  }
  return data;
}
