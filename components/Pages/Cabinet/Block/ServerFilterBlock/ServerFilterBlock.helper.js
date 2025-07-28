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
  const arrayOfServerFilterBlockData = convertingServerFilterBlockData(serverFilters);

  const concatServerFilterBlockData = [].concat(...arrayOfServerFilterBlockData);

  return concatServerFilterBlockData;
}

export function getUniqueArraysOfServerFilters(serverFilters) {
  const notFiltereServerFilters = rebuildArrayOfServerFilterBlockData(serverFilters);

  const ServerFiltersConcat = [].concat(...notFiltereServerFilters);

  const arrOfUniqueServerFilters = ServerFiltersConcat.filter((item) => parseInt(item, 10));

  return arrOfUniqueServerFilters;
}

export function uniqueServerFilters(serverFilters) {
  const notFilteredServerFilters = getUniqueArraysOfServerFilters(serverFilters);
  const reducedArrayServerFilters = [].concat(...notFilteredServerFilters);

  const uniqueFilters = [...new Set(reducedArrayServerFilters)];

  return uniqueFilters;
}

export function interSectionBetweenDropListServerFilters(dropList, dataBlocks) {
  const dropDownList = uniqueServerFilters(dropList);
  const serverFilterBlocks = uniqueServerFilters(dataBlocks);
  /////// ошибка здесь
  const intersectionDropListdataBlocks = dropDownList.filter((x) => serverFilterBlocks.includes(x));

  // console.log(
  //   "intersectionDropListdataBlocks:",
  //   intersectionDropListdataBlocks
  // );

  return intersectionDropListdataBlocks;
}

export function elementDateWasChoosenByUser(dropList, dataBlocks) {
  const interSectionArray = interSectionBetweenDropListServerFilters(dropList, dataBlocks);

  // console.log("intersectionArray", interSectionArray);

  const dateChoosenByUser = interSectionArray.find((item) => typeof item === "string");
  // console.log("dateChoosenByUser:", dateChoosenByUser);
  const objectShouldBeCashed = dropList.find((item) => item.value === dateChoosenByUser);
  // console.log("objectShouldBeCashed:", objectShouldBeCashed);

  return objectShouldBeCashed;
}
