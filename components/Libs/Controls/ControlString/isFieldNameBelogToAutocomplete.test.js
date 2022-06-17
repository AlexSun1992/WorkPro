import { data } from "./isFieldNameBelogToAutocomplete.fixtures";
import { isFieldNameBelogToAutocomplete } from "./isFieldNameBelogToAutocomplete";

describe("Определяем какому типу control соответствует field", () => {
  it("Выявить принадлежность field к типу контрола Autocomplete", () => {
    const TEST_DATA = [...data];
    const isAutocomplete = isFieldNameBelogToAutocomplete(
      TEST_DATA,
      "SOCCASION"
    );
    expect(isAutocomplete).toBe(false);
  });
  it("Выявить принадлежность поля для типа Autocomplete", () => {
    const TEST_DATA = [...data];
    const isBelongToAutocomplete = isFieldNameBelogToAutocomplete(
      TEST_DATA,
      "SSECONDNAME"
    );
    expect(isBelongToAutocomplete).toBe(true);
  });
});
