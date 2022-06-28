// eslint-disable-next-line import/prefer-default-export
export function getCopyFiltersFromServerFilters(serverFilters) {
  const copyArrayOfFilters = serverFilters.map((item) => ({ ...item }));
  return copyArrayOfFilters;
}

export function getArrayOfArrays(serverFilters) {
  const copyArray = getCopyFiltersFromServerFilters(serverFilters);
  const entriesFromServerFilters = copyArray.map((i) => {
    return Object.entries(i);
  });
  return entriesFromServerFilters;
}

export function concatArrays(serverFilters) {
  const arrayOfArray = getArrayOfArrays(serverFilters);
  const concatInnerArray = [].concat(...arrayOfArray);
  return concatInnerArray;
}

export function filterInnerArrays(serverFilters, target) {
  const notFilteredArray = concatArrays(serverFilters);
  const filteredArray = notFilteredArray.filter((item) =>
    item.includes(target)
  );
  return filteredArray;
}

export function uniqueElementsOfArray(serverFilters, target) {
  const notFilteredElements = filterInnerArrays(serverFilters, target);
  const concatElements = [].concat(...notFilteredElements);
  const uniqueConcatElements = [...new Set(concatElements)];
  return uniqueConcatElements;
}

export function interSectionElement(
  dictionary,
  dataBlocks,
  firstParam,
  secondParam
) {
  const firstArr = uniqueElementsOfArray(dictionary, firstParam);
  const secondArray = uniqueElementsOfArray(dataBlocks, secondParam);
  const intersection = firstArr.filter((x) => secondArray.includes(x));
  return intersection;
}

export function elementShoudBeChoosen(
  dictionary,
  dataBlocks,
  firstParam,
  secondParam
) {
  const interSectionArray = interSectionElement(
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
