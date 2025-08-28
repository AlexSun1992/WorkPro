export function findUnSensitiveCaseCoincidence(el, value) {
  try {
    return el.toUpperCase().includes(value.toUpperCase());
  } catch (err) {
    return undefined;
  }
}
