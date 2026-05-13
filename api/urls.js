/* eslint-disable */
const VER = "v2";
const AUTH = `/lk/authw/${VER}/authorize`;
const REFRESH_TOKEN = `/lk/authw/${VER}/token_refresh`;
const SOCKET = "wss://lk.reso.ru/chat";
const MODULE = `/lk/main/${VER}/module`;
const MENU = `/lk/main/${VER}/menu`;
const CLIENTMENU = `/lk/main/${VER}/clientmenu`;
const CLIENTFREEMENU = `/lk/free/${VER}/menu`;
const DATACARD = `/lk/main/${VER}/datacard`;
const DATA = `/lk/main/${VER}/data`;
const FREEDATA = `/lk/free/${VER}/data`;
const DATALIST = `/lk/main/${VER}/datalist`;
const FILTER = `/lk/main/${VER}/filter`;
const ACTIONPARAM = `/lk/main/${VER}/actionparam`;
const FREEACTIONPARAM = `/lk/free/${VER}/actionparam`;
const ACTIONEXEC = `/lk/main/${VER}/actionexec`;
const FREEACTIONEXEC = `/lk/free/${VER}/actionexec`;
const ONETOMANYDATA = `/lk/main/${VER}/one2manydata`;
const CHATS = `/lk/main/${VER}/chat/data/chats`;
const MESSAGESCHAT = `/lk/main/${VER}/chat/data/messageschat`;
const MESSAGECHAT = `/lk/main/${VER}/chat/data/messagechat`;
const USERPROFILE = `/lk/main/${VER}/userinfo`;
const USERBFFPROFILE = `/api/userinfo`;
const WEBFIELD = `/lk/main/${VER}/webfield`;
const DIC = `/lk/main/${VER}/dic`;
const DICWF = `/lk/main/${VER}/dicwf`;
const FREEDICWF = `/lk/free/${VER}/dicwf`;
const REPORT = `/lk/main/${VER}/report`;
const FREEDATACARD = `/lk/free/${VER}/datacard`;
const FREEMENU = `/lk/free/${VER}/menu`;
const CAPTCHA = `/lk/authw/${VER}/captcha`;
const AUTO = `/lk/main/${VER}/auto`;

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
