export function getDate(str) {
  const splitSrt = str?.split(".");

  if (Array.isArray(splitSrt) && splitSrt.length === 3) {
    return new Date(splitSrt.reverse().join("-"));
  }

  return null;
}
