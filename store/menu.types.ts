export type ActionInfo = {
  /** Использовать в карточке */
  LUSEINCARD: boolean;
  LIDLIST: boolean;
  /** Выбрано по-умолчанию */
  LSELECTDEFAULT: boolean;
  /** Показывать рядом с кнопками для WEB */
  LINBUTTONS: boolean;
  /** Номер пункта меню */
  NITEM: number;
  /** Создавать кнопку в карточке */
  LCREATEBUTTON: boolean;
  /** Проверять доступ к действию */
  LCHECKACCESS: boolean;
  /** Взять из датасет значение поля */
  LFROMDATASET: boolean;
  /** Показывать в гриде для WEB */
  LINLIST: boolean;
  /** У процедуры есть Out параметр */
  LOUTPARAM: boolean;
  /** Перед действием сохранить карточку */
  LWITHCOMMIT: boolean;
  /** ID действия */
  ID: number;
  /** Выполнять в текущем окне */
  LCURWINDOW: boolean;
  /** Мультиселект */
  LMULTISELECT: boolean;
  /** Наим. процедуры, константы */
  SCONST: string;
  /** Наименование действия */
  SNAME: string;
  /** Действие можно вызывать во Free зоне для REST */
  LFREEZONE: boolean;
  /** Требовать подтверждения СМС кодом */
  LREQUESTCODE: boolean;
  /** Закрыть окно после действия */
  LCLOSEAFTER: boolean;
  /** Показывать в Действиях для WEB */
  LINACTIONS: boolean;
  /** Обновлять карточку после выполнения действия */
  LREFRESH: boolean;
  /** REL-action */
  REL: string;
  /** Ключевое поле связи */
  SFIELD: string;
  /** Тип действия */
  NTYPE: number;
  /** Не показвать диалог перед действием */
  LHIDEDLG: boolean;
  /** Код модуля */
  IDADMMODULE: number;
  LNEEDPARAM: boolean;
  /** Скрывать действие в списке */
  LHIDEINLIST: boolean;
  /** Показывать в toolbar для WEB */
  LTOOLBAR: boolean;
  /** Сообщение после выполнения действия */
  SMESSAGE?: string;
};

const actionTypeTest: ActionInfo[] = [
  {
    LUSEINCARD: true,
    LIDLIST: false,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: true,
    LWITHCOMMIT: false,
    ID: 41412,
    LCURWINDOW: false,
    LMULTISELECT: false,
    SCONST: "i3.pkg_lk_utils.GenerateURLforSignature",
    SNAME: "Подписание документов",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "E9540701F49EA3A3ED123EBCC6E0F391",
    SFIELD: "id",
    NTYPE: 4,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: false,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: false,
    LWITHCOMMIT: false,
    ID: 43031,
    LCURWINDOW: false,
    LMULTISELECT: false,
    SCONST: "const cPolicyMortgage",
    SNAME: "Скачать полис",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "C896075449EA5A1E737D503510217DA1",
    SFIELD: "id",
    NTYPE: 3,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: true,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: false,
    LWITHCOMMIT: false,
    ID: 38843,
    LCURWINDOW: true,
    LMULTISELECT: false,
    SCONST: "961",
    SNAME: "Правила страхования",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "6ACC2FAB1BF49466C984BC628A2CFA75",
    SFIELD: "id",
    NTYPE: 2,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: false,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: true,
    LWITHCOMMIT: false,
    ID: 38347,
    LCURWINDOW: false,
    LMULTISELECT: false,
    SCONST: "i3.pkg_lk_utils.GenerateUrlForRepeatSendPolicyDocs",
    SNAME: "Отправить полис на электронную почту",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "7D1F2DBD20CB0242092CD31F818A0C3A",
    SFIELD: "Id",
    NTYPE: 4,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: true,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: false,
    LWITHCOMMIT: false,
    ID: 38690,
    LCURWINDOW: true,
    LMULTISELECT: false,
    SCONST: "952",
    SNAME: "Платежи по полису",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "040C77D1BA8B28EA9333017C797C8C94",
    SFIELD: "id",
    NTYPE: 2,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: false,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: true,
    LWITHCOMMIT: false,
    ID: 38372,
    LCURWINDOW: false,
    LMULTISELECT: false,
    SCONST: "i3.pkg_lk_utils.PayLinkAccrualForPolicy",
    SNAME: "Оплатить",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "CC6B5B74275E57BA059B2FE73AEC6E6E",
    SFIELD: "id",
    NTYPE: 4,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
  {
    LUSEINCARD: true,
    LIDLIST: true,
    LSELECTDEFAULT: false,
    LINBUTTONS: false,
    NITEM: 941,
    LCREATEBUTTON: false,
    LCHECKACCESS: false,
    LFROMDATASET: false,
    LINLIST: false,
    LOUTPARAM: false,
    LWITHCOMMIT: false,
    ID: 38658,
    LCURWINDOW: true,
    LMULTISELECT: false,
    SCONST: "946",
    SNAME: "Страховые случаи по полису",
    LFREEZONE: false,
    LREQUESTCODE: false,
    LCLOSEAFTER: false,
    LINACTIONS: true,
    LREFRESH: false,
    REL: "91529B97917365443D40392632A48894",
    SFIELD: "id",
    NTYPE: 2,
    LHIDEDLG: true,
    IDADMMODULE: 55,
    LNEEDPARAM: false,
    LHIDEINLIST: false,
    LTOOLBAR: false,
  },
];
