import { isFieldNameBelogToAutocomplete } from "./StringAutocomplete.helpers";

describe("Определяем какому типу control соответствует field", () => {
  it("Выбранное поле не приндлежит к типу Autocomplete", () => {
    const isAutocomplete = isFieldNameBelogToAutocomplete("SOCCASION");
    expect(isAutocomplete).toBe(false);
  });

  it("Выбранное поле принадлежит к типу Autocomplete", () => {
    const isBelongToAutocomplete = isFieldNameBelogToAutocomplete("ADDRESS_REG");
    expect(isBelongToAutocomplete).toBe(true);
  });

  it("Выбранное поле не принадлежит к типу Autocomplete", () => {
    const isBelongToAutocomplete = isFieldNameBelogToAutocomplete("FIRSTNA");
    expect(isBelongToAutocomplete).toBe(false);
  });
});
