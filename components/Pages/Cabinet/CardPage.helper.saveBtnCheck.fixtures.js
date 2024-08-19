const formData = new FormData();
const mockDock = [
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
  {
    FILENAME: "ОСАГО.pdf",
    SIZE: 195885,
    NAME: "EPROTOKOLGUILTY1",
  },
];
formData.append("JSON", JSON.stringify({ FILES: mockDock }));
export const paramsDTP = {
  idModule: "55",
  idParent: "0",
  idItem: "1008",
  idCard: "2508424119",
  idRel: "9917E63E9104B66D3C9D4021E0B16160",
};

export const fetchFormParamsDTP = {
  idModule: "55",
  idItem: "1008",
  idCard: "2508424119",
  idRel: "9917E63E9104B66D3C9D4021E0B16160",
  query: {},
};

export const fetchMenuDTP = [
  {
    name: "Клиент РЕСО",
    url: "/55",
    id: 55,
    icon: "",
    children: [],
  },
];

export const fetchCountersValueDTP = [
  {
    _struct: [
      {
        FIELDS: [],
        ORA_PRECISION: 0,
        FIELD: "IDITEM",
        ORA_SCALE: -127,
        REQUIRED: false,
        NULLABLE: true,
        PRECISION: 3,
        VISIBLE: true,
        ORDER: 1,
        TYPE_COLUMN: "NUMBER",
        SIGNED: true,
        SCALE: 0,
        TYPE: "double",
        READONLY: false,
      },
    ],
    _info: {
      recordCountError: false,
    },
    _meta: {
      JSONWEBFIELDS: [],
    },
  },
];

export const fetchFormReturnValueNoRequiredDocsDTP = {
  data: [
    {
      label: "Код",
      value: 0,
      id: "1008",
      type: "double",
      maxlength: 1,
      name: "ID",
      visible: false,
      required: false,
      readonly: false,
      control: null,
      state: null,
      isTab: false,
    },
    {
      label: "FILE_TYPES",
      value: [[Object], [Object], [Object]],
      id: "1008",
      type: "json_array",
      maxlength: 774,
      name: "FILE_TYPES",
      visible: true,
      required: false,
      readonly: false,
      control: null,
      state: null,
      isTab: false,
    },
  ],
  metaData: {
    data: [
      {
        label: "Файлы",
        value: formData,
        type: "uploadFiles",
        structType: "json_array",
        visible: true,
        fileSettings: [
          {
            label: "FILE_TYPES",
            value: [
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Лицевая сторона бумажного бланка Извещения о ДТП",
                MIN_FILE_COUNT: 0,
                MAX_FILE_COUNT: 3,
                TYPE_TITLE: "Обязательные документы",
                TYPE_DESCRIPTION:
                  "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Оборотная сторона бумажного бланка Извещения о ДТП",
                MIN_FILE_COUNT: 0,
                MAX_FILE_COUNT: 3,
                TYPE_TITLE: "Обязательные документы",
                TYPE_DESCRIPTION:
                  "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                NAME: "EPROTOKOLGUILTY2",
              },
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Фото с места ДТП",
                MIN_FILE_COUNT: 0,
                MAX_FILE_COUNT: 10,
                TYPE_TITLE: "Дополнительные документы",
                TYPE_DESCRIPTION: "",
                NAME: "PHOTO",
              },
            ],
          },
          {
            label: "FILES",
            value: [
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
            ],
          },
        ],
      },
    ],
    defaultValues: {},
    btnSave: true,
    btnCancel: false,
    readonly: false,
    visible: {},
    addFields: {},
    breadCrumbs: [{ text: "Личный кабинет", href: "/cabinet/55/0/701" }],
    itemId: "1008",
  },
};

export const fetchFormReturnValueDTP = {
  metaData: {
    data: [
      {
        label: "Файлы",
        value: formData,
        type: "uploadFiles",
        structType: "json_array",
        fileSettings: [
          {
            label: "FILE_TYPES",
            value: [
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Лицевая сторона бумажного бланка Извещения о ДТП",
                MIN_FILE_COUNT: 1,
                MAX_FILE_COUNT: 3,
                TYPE_TITLE: "Обязательные документы",
                TYPE_DESCRIPTION:
                  "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Оборотная сторона бумажного бланка Извещения о ДТП",
                MIN_FILE_COUNT: 1,
                MAX_FILE_COUNT: 3,
                TYPE_TITLE: "Обязательные документы",
                TYPE_DESCRIPTION:
                  "pdf, jpg, jpeg, bmp, png, tif, gif не более 20 мб",
                NAME: "EPROTOKOLGUILTY2",
              },
              {
                MAX_FILE_SIZE: 3145728,
                DESCRIPTION: "",
                TITLE: "Фото с места ДТП",
                MIN_FILE_COUNT: 0,
                MAX_FILE_COUNT: 10,
                TYPE_TITLE: "Дополнительные документы",
                TYPE_DESCRIPTION: "",
                NAME: "PHOTO",
              },
            ],
          },
          {
            label: "FILES",
            value: [
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
              {
                FILENAME: "ОСАГО.pdf",
                SIZE: 195885,
                NAME: "EPROTOKOLGUILTY1",
              },
            ],
          },
        ],
        id: "1008",
        fieldId: 56358,
        cols: 12,
        colSm: 12,
        colMd: 12,
        isMask: false,
        colLg: 12,
        width: "100%",
        name: "FILES",
      },
    ],
    defaultValues: {},
    btnSave: true,
    btnCancel: false,
    readonly: false,
    visible: {},
    addFields: {},
    breadCrumbs: [{ text: "Личный кабинет", href: "/cabinet/55/0/701" }],
    itemId: "1008",
  },
};

export const menuResponseDTP = {
  settings: {
    LCLOSEAFTERSAVE: false,
    LNEW: false,
    LEDIT: true,
    ID: 12052,
    IDITEM: 1008,
    LSHOW: true,
    ONETOMANYCUR: [],
    IDPARENT: 0,
    LNEWRECORDMETHOD: true,
    LSHOWLISTROUTE: true,
    WIZARDCUR: [],
    LDELETE: false,
    FILTERCUR: [],
    SNAME: "Отправка извещения о ДТП",
    LSHOWCARDROUTE: true,
    NONETOMANY: 0,
    LCANLIST: false,
    LNOTCARD: false,
    ACTIONSCUR: [],
    LFIRSTLOADRECORD: true,
    LTABBED: false,
    LPRINT: false,
  },
  subSettings: {
    name: "Отправка извещения о ДТП",
    url: "/cabinet/55/0/1008",
    id: 12052,
    icon: "",
    idItem: 1008,
    idParent: 0,
    parentMenu: null,
    compType: 9,
    recordLoad: true,
    newRecord: false,
    filters: [],
    actions: [],
    tabs: [],
    add: false,
    edit: true,
    delete: false,
    cols: 1,
    isCard: false,
    isWizard: false,
    isUploader: false,
    isForm: true,
    isPortal: false,
    isTelemed: false,
    wizard: [],
    portalgrid: null,
    cardgrid: null,
    cardtemplate: null,
    isModal: false,
    closeAfterSave: false,
    newCount: null,
  },
};
