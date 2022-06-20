import { data } from "./StringAutocomplete.helpers.fixtures";
import { isFieldNameBelogToAutocomplete } from "./StringAutocomplete.helpers";

describe("Определяем какому типу control соответствует field", () => {
  it("Выбранное поле не приндлежит к типу Autocomplete", () => {
    const TEST_DATA = [...data];
    const isAutocomplete = isFieldNameBelogToAutocomplete(
      TEST_DATA,
      "SOCCASION"
    );
    expect(isAutocomplete).toBe(false);
  });
  it("Выбранное поле принадлежит к типу Autocomplete", () => {
    const TEST_DATA = [...data];
    const isBelongToAutocomplete = isFieldNameBelogToAutocomplete(
      TEST_DATA,
      "SSECONDNAME"
    );
    expect(isBelongToAutocomplete).toBe(true);
  });
});
