/* eslint-disable */
const VER = "v2";
const AUTH = `/am/authw/${VER}/authorize`;
const REFRESH_TOKEN = `/am/authw/${VER}/token_refresh`;
const SOCKET = "wss://lk.reso.ru/chat";
const MODULE = `/am/main/${VER}/module`;
const MENU = `/am/main/${VER}/menu`;
const CLIENTMENU = `/am/main/${VER}/clientmenu`;
const CLIENTFREEMENU = `/am/free/${VER}/menu`;
const DATACARD = `/am/main/${VER}/datacard`;
const DATA = `/am/main/${VER}/data`;
const FREEDATA = `/am/free/${VER}/data`;
const DATALIST = `/am/main/${VER}/datalist`;
const FILTER = `/am/main/${VER}/filter`;
const ACTIONPARAM = `/am/main/${VER}/actionparam`;
const FREEACTIONPARAM = `/am/free/${VER}/actionparam`;
const ACTIONEXEC = `/am/main/${VER}/actionexec`;
const FREEACTIONEXEC = `/am/free/${VER}/actionexec`;
const ONETOMANYDATA = `/am/main/${VER}/one2manydata`;
const CHATS = `/am/main/${VER}/chat/data/chats`;
const MESSAGESCHAT = `/am/main/${VER}/chat/data/messageschat`;
const MESSAGECHAT = `/am/main/${VER}/chat/data/messagechat`;
const USERPROFILE = `/am/main/${VER}/userinfo`;
const USERBFFPROFILE = `/api/userinfo`;
const WEBFIELD = `/am/main/${VER}/webfield`;
const DIC = `/am/main/${VER}/dic`;
const DICWF = `/am/main/${VER}/dicwf`;
const FREEDICWF = `/am/free/${VER}/dicwf`;
const REPORT = `/am/main/${VER}/report`;
const FREEDATACARD = `/am/free/${VER}/datacard`;
const FREEMENU = `/am/free/${VER}/menu`;
const CAPTCHA = `/am/authw/${VER}/captcha`;
const AUTO = `/am/main/${VER}/auto`;

export default {
  VER: VER,
  AUTH: AUTH,
  REFRESH_TOKEN: REFRESH_TOKEN,
  SOCKET: SOCKET,
  MODULE: MODULE,
  MENU: MENU,
  CLIENTMENU: CLIENTMENU,
  CLIENTFREEMENU: CLIENTFREEMENU,
  DATACARD: DATACARD,
  FREEDATACARD: FREEDATACARD,
  FREEMENU: FREEMENU,
  DATA: DATA,
  FREEDATA: FREEDATA,
  DATALIST: DATALIST,
  FILTER: FILTER,
  ACTIONPARAM: ACTIONPARAM,
  FREEACTIONPARAM: FREEACTIONPARAM,
  ACTIONEXEC: ACTIONEXEC,
  FREEACTIONEXEC: FREEACTIONEXEC,
  ONETOMANYDATA: ONETOMANYDATA,
  CHATS: CHATS,
  MESSAGESCHAT: MESSAGESCHAT,
  MESSAGECHAT: MESSAGECHAT,
  USERPROFILE: USERPROFILE,
  WEBFIELD: WEBFIELD,
  DIC: DIC,
  DICWF: DICWF,
  FREEDICWF: FREEDICWF,
  REPORT: REPORT,
  CAPTCHA: CAPTCHA,
  USERBFFPROFILE: USERBFFPROFILE,
  AUTO,
};
