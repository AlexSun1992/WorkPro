const VER = 'v2'
const AUTH = `/am/auth/${VER}/authorize`
const REFRESH_TOKEN = `/am/auth/${VER}/token_refresh`
const SOCKET = `wss://mobile2.reso.ru/chat`
const MODULE = `/am/main/${VER}/module`
const MENU = `/am/main/${VER}/menu`
const DATACARD = `/am/main/${VER}/datacard`
const DATA = `/am/main/${VER}/data`
const FILTER = `/am/main/${VER}/filter`
const ACTIONPARAM = `/am/main/${VER}/actionparam`
const ACTIONEXEC = `/am/main/${VER}/actionexec`
const ONETOMANYDATA = `/am/main/${VER}/one2manydata`
const CHATS = `/am/main/${VER}/chat/data/chats`
const MESSAGESCHAT = `/am/main/${VER}/chat/data/messageschat`
const MESSAGECHAT = `/am/main/${VER}/chat/data/messagechat`
const USERPROFILE = `/am/main/${VER}/userinfo`
const WEBFIELD = `/am/main/${VER}/webfield`

export default {
  VER: VER,
  AUTH: AUTH,
  REFRESH_TOKEN: REFRESH_TOKEN,
  SOCKET: SOCKET,
  MODULE: MODULE,
  MENU: MENU,
  DATACARD: DATACARD,
  DATA: DATA,
  FILTER: FILTER,
  ACTIONPARAM: ACTIONPARAM,
  ACTIONEXEC: ACTIONEXEC,
  ONETOMANYDATA: ONETOMANYDATA,
  CHATS: CHATS,
  MESSAGESCHAT: MESSAGESCHAT,
  MESSAGECHAT: MESSAGECHAT,
  USERPROFILE: USERPROFILE,
  WEBFIELD: WEBFIELD
}
