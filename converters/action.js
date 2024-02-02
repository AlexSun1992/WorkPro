const converter = {};

converter.action = (data) =>
  data.map((item) => ({
    label: item.SNAME,
    id: item.ID,
    type: item.NTYPE,
    command: item.SCONST,
    relaction: item.REL,
    isDialog: !item.LHIDEDLG,
    isCurrentWindow: item.LCURWINDOW,
    field: item.SFIELD,
    refresh: item.LREFRESH,
    closeAfter: item.LCLOSEAFTER,
  }));

export default converter;
