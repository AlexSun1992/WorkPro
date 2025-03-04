export const variantPolicyUtils = {
  /**
   *
   * @param order {Array} - упорядоченный одномертный массив описывающий порядок полей
   * @param hints {Array} - одномерный массив подсказок. индекс массива для подсказки совпадает с индексом массива сортировки
   * @return {Array} - Возвращается массив объектов ключами которго являются имена полей а значениями подсказки
   */
  getHintsListByName(order = [], hints = []) {
    if (!Array.isArray(order) || !Array.isArray(hints)) {
      return null;
    }

    return hints.map((item, index) => this.createHintItem(order[index], item)) ?? [];
  },

  createHintItem(fieldName, hint) {
    if (typeof fieldName !== "string") {
      return null;
    }

    return { [fieldName?.toUpperCase()]: hint };
  },

  /**
   *
   * @param order {Array} - упорядоченный одномертный массив описывающий порядок полей
   * @param featuresData {Object} - объект со значениями для варианта. ключами объекта являются названия полей в верхнем регистре
   * @param featuresHint {Array} - массив объектов ключём которого является имя поля значением подсказка
   * @return {Array}
   */
  getFeaturesList(order, featuresData, featuresHint) {
    return order?.map((item) => ({
      field: item,
      text: featuresData[item],
      hint: featuresHint?.find((hint) => hint[item])?.[item] ?? "",
    })) ?? [];
  }
}
