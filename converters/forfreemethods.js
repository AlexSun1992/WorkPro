const converter = {};

converter.osago = (data) => {
  const arr = [];
  const captions = data.metaData.captions.split(";");
  for (let i = 0; i < captions.length; i++) {
    const obj = {};
    obj.label = captions[i];
    obj.page = i;
    obj.displayed = true;
    obj.visible = false;
    obj.previewText = "";
    obj.loading = false;
    arr.push(obj);
  }
  arr.pop();
  data.metaData.captions = arr;
  return data.metaData;
};

export default converter;
