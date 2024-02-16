const isPermittedIp = (subnetList, clientIp, staticSentryIp) => {
  const isIpPermitted = subnetList.some(
    (elem) => clientIp.startsWith(elem) === true
  );

  const isSentryIp = staticSentryIp === clientIp;

  if (isIpPermitted || isSentryIp) {
    return true;
  }
  return false;
};

module.exports = { isPermittedIp };
