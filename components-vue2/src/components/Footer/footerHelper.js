export default function getSpecificObject(arrayOfObjects, specificObjectTitle) {
  return arrayOfObjects.filter((item) => {
    return item.title === specificObjectTitle;
  });
}
