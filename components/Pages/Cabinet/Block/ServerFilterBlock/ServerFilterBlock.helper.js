// eslint-disable-next-line import/prefer-default-export
export function getCopyArrayOfObjects(serverFilters) {
  const copyArrayOfFilters = serverFilters.map((item) => ({ ...item }));
  return copyArrayOfFilters;
}

export function convertingArrayOfObjectsToArrayOfArrays(serverFilters) {
  const copyArray = getCopyArrayOfObjects(serverFilters);
  const entriesFromServerFilters = copyArray.map((i) => {
    return Object.entries(i);
  });
  return entriesFromServerFilters;
}

export function makingArrayOfConcatArrays(serverFilters) {
  const arrayOfArray = convertingArrayOfObjectsToArrayOfArrays(serverFilters);
  const concatInnerArray = [].concat(...arrayOfArray);
  return concatInnerArray;
}

export function filterInnerArrays(serverFilters, target) {
  const notFilteredArray = makingArrayOfConcatArrays(serverFilters);
  const filteredArray = notFilteredArray.filter((item) =>
    item.includes(target)
  );
  return filteredArray;
}

export function createArrayOfUniqueElements(serverFilters, target) {
  const notFilteredElements = filterInnerArrays(serverFilters, target);
  const concatElements = [].concat(...notFilteredElements);
  const uniqueConcatElements = [...new Set(concatElements)];
  return uniqueConcatElements;
}

export function interSectionElementArray(
  dictionary,
  dataBlocks,
  firstParam,
  secondParam
) {
  const firstArr = createArrayOfUniqueElements(dictionary, firstParam);
  const secondArray = createArrayOfUniqueElements(dataBlocks, secondParam);
  const intersection = firstArr.filter((x) => secondArray.includes(x));
  return intersection;
}

export function elementDateWasChoosenByUser(
  dictionary,
  dataBlocks,
  firstParam,
  secondParam
) {
  const interSectionArray = interSectionElementArray(
    dictionary,
    dataBlocks,
    firstParam,
    secondParam
  );

  const getInterSection = interSectionArray.find(
    (item) => typeof item === "string"
  );
  const currentIntersection = dictionary.find(
    (item) => item.value === getInterSection
  );

  return currentIntersection;
}
