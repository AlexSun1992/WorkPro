let toggleDisplay = (page, renderOptions) => {
  renderOptions = renderOptions.map((item, index) => {
    if (index <= page) {
      item.displayed = true;
      return item;
    }
  });
};
let getPage = (id, state) => {
  let item = state.data.data.find((item) => {
    return item.fieldId === id;
  });
  return item.page + 1;
};

let getOptions = (state) => {
  return Array.from({ length: state.data.captions.length }, () => {
    let obj = new Object();
    obj.visible = false;
    obj.displayed = false;
    obj.previewText = "";
    obj.loading = false;
    return obj;
  });
};

let getTemplate = (res) => {
  return `<ul>
    <li>Марка-модель: <b>${res.data[0].SMODEL}</b></li>
    <li>Тип ТС: <b>${res.data[0].IDCAR_BODY_TYPE}</b></li>
    <li>Год выпуска: <b>${res.data[0].NBUILD_YEAR}</b></li>
    <li>Мощность: <b>${res.data[0].NOUTPUT} л.с.</b></li>
    <li>VIN: <b>${res.data[0].SVIN}</b></li>
    <li>СТС: <b>${res.data[0].SSTS_NUMBER} от ${res.data[0].DTEH_OSMOTR_DATE}</b></li>
</ul>`;
};

export { toggleDisplay, getPage, getOptions, getTemplate };
