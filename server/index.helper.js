const isPermittedIp = (subnetList, clientIp) => {
  const isIpPermitted = subnetList.some((elem) => clientIp.startsWith(elem) === true);

  return Boolean(isIpPermitted);
};

module.exports = { isPermittedIp };
