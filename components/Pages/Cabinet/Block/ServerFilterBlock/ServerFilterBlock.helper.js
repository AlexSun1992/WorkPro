export function getCopyOfServerFilterBlockData(serverFilters) {
  const copyArrayOfFilters = serverFilters.map((item) => ({ ...item }));
  return copyArrayOfFilters;
}

export function convertingServerFilterBlockData(serverFilters) {
  const copyArrayServerFilters = getCopyOfServerFilterBlockData(serverFilters);
  const getEntriesFromServerFilters = copyArrayServerFilters.map((i) => {
    return Object.entries(i);
  });
  return getEntriesFromServerFilters;
}

export function rebuildArrayOfServerFilterBlockData(serverFilters) {
  const arrayOfServerFilterBlockData =
    convertingServerFilterBlockData(serverFilters);
  const concatServerFilterBlockData = [].concat(
    ...arrayOfServerFilterBlockData
  );
  return concatServerFilterBlockData;
}

export function getUniqueArraysOfServerFilters(serverFilters, property) {
  const notFiltereServerFilters =
    rebuildArrayOfServerFilterBlockData(serverFilters);

  const arrOfUniqueServerFilters = notFiltereServerFilters.filter((item) =>
    item.includes(property)
  );

  return arrOfUniqueServerFilters;
}

export function uniqueServerFilters(serverFilters, property) {
  const notFilteredServerFilters = getUniqueArraysOfServerFilters(
    serverFilters,
    property
  );
  const reducedArrayServerFilters = [].concat(...notFilteredServerFilters);
  const uniqueFilters = [...new Set(reducedArrayServerFilters)];
  return uniqueFilters;
}

export function interSectionBetweenDropListServerFilters(
  dropList,
  dataBlocks,
  dropListValue,
  dataBlocksValue
) {
  const dropDownList = uniqueServerFilters(dropList, dropListValue);
  const serverFilterBlocks = uniqueServerFilters(dataBlocks, dataBlocksValue);
  const intersectionDropListdataBlocks = dropDownList.filter((x) =>
    serverFilterBlocks.includes(x)
  );
  return intersectionDropListdataBlocks;
}

export function elementDateWasChoosenByUser(
  dropList,
  dataBlocks,
  dropListValue,
  dataBlocksValue
) {
  const interSectionArray = interSectionBetweenDropListServerFilters(
    dropList,
    dataBlocks,
    dropListValue,
    dataBlocksValue
  );

  const dateChoosenByUser = interSectionArray.find(
    (item) => typeof item === "string"
  );

  const objectShouldBeCashed = dropList.find(
    (item) => item.value === dateChoosenByUser
  );

  return objectShouldBeCashed;
}
