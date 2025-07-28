export const TokenBoxTestData = {
  propsDataCorrect: {
    data: {
      value: [1, 2, 3],
      options: [
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
        { value: 5, text: "5" },
        { value: 6, text: "6" },
      ],
      valueKey: "value",
      textKey: "text",
      showClear: true,
      placeholder: "Placeholder!!!",
      searchable: false,
    },
  },
  propsDataError: {
    data: {
      value: [10, 20, 3],
      options: [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" },
      ],
      valueKey: "",
      textKey: "",
      showClear: true,
      placeholder: "Test data",
    },
  },
};
