class ControlTokenBoxClass {
  // Название ключа по которому берётся значение для элемента списка
  valueKey = 'value';
  // Название ключа по которому берётся тест для элемента списка
  textKey = 'text';
  placeholder = "";
  // Будет ли закрываться меню после выбора итема
  closeAfterSelect = true;
  // Будет ли отображется крестик для каждого выбранного элемента
  showClear = true;
  // Список элементов списка. Элемент описан классом ControlTokenBoxOption
  options = [];
  value = [];

  constructor(data) {
    this.valueKey = data.valueKey ?? this.valueKey;
    this.textKey = data.textKey ?? this.textKey;
    this.placeholder = data.placeholder ?? this.placeholder;
    this.closeAfterSelect = data.textKey ?? this.closeAfterSelect;
    this.showClear = data.valueKey ?? this.showClear;
    this.options = this.options?.map(item => new ControlTokenBoxOption(item, {
      valueKey: this.valueKey,
      textKey: this.textKey
    }));
    this.value = data.textKey ?? this.value;
  }
}

class ControlTokenBoxOption {
  // Элемент не будет виден в списке меню. Например мы можем показать како-то значение по умолчанию но выбрать его нельзя
  invisible = false;
  // Элемент виден но его нельзя выбрать
  disabled = false;
  value = null;
  text = null;

  constructor(data, config) {
    this.invisible = data.invisible ?? this.invisible;
    this.disabled = data.disabled ?? this.disabled;
    this.value = data[config.valueKey];
    this.text = data[config.textKey];
  }
}

export { ControlTokenBoxOption, ControlTokenBoxClass };
