export default function getSpecificObject(arrayOfObjects, specificObjectTitle) {
  return arrayOfObjects.filter((item) => item.title === specificObjectTitle);
}
