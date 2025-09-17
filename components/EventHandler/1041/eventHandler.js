export function eventHandler(data) {
  return data;
}

export function initHandler(data) {
  const thirdname = data.find(({ name }) => name === "STHIRDNAME");

  if (thirdname.value) {
    thirdname.state = true;
    thirdname.error = null;
  }

  return data;
}
