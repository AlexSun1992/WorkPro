import dataform from "./dataform";

describe("dataform converter", () => {
  it("Корректно сохраняет объект в DadataSelect 2", () => {
    const convertedData = dataform.save([
      {
        type: "DadataSelect2",
        name: "field",
        value: { value: "bankname" },
      },
    ]);

    expect(convertedData.field).toBe('{"value":"bankname"}');
  });

  it("Корректно сохраняет строку в DadataSelect 2", () => {
    const convertedData = dataform.save([
      {
        type: "DadataSelect2",
        name: "field",
        value: "bankname",
      },
    ]);

    expect(convertedData.field).toBe("bankname");
  });
});
