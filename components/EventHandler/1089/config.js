export const config1 = {
  fields: [
    {
      id: "isEmployed",
      visible: {
        condition: { type: "always", value: true },
      },
    },
    {
      id: "jobTitle",
      visible: {
        condition: {
          type: "equals",
          source: "isEmployed",
          value: true,
        },
      },
      disabled: {
        condition: {
          type: "not",
          condition: { type: "equals", source: "isEmployed", value: true },
        },
      },
      className: {
        condition: { type: "equals", source: "isEmployed", value: true },
        value: "employment-field",
      },
    },
    {
      id: "age",
      readOnly: {
        condition: { type: "greaterThanOrEquals", source: "age", value: 18 },
      },
    },
  ],
};
export const config2 = {
  fields: [
    {
      name: "next",
      conditions: [
        {
          type: "and",
          sources: [{ name: "page", value: 1 }],
          property: "visible",
          value: false,
        },
        {
          type: "not",
          sources: ["TEST1", "TEST2"],
          property: "visible",
          value: true,
        },
      ],
    },
    {
      name: "SMODEL",
      conditions: [
        {
          type: "and",
          sources: [
            { name: "page", value: 1 },
            { name: "IDMODEL", value: "Иное" },
          ],
          property: "visible",
          value: true,
        },
      ],
    },
  ],
};
export const config = {
  init: {
    fields: [
      {
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 1 },
              { name: "ID", value: 0 },
            ],
            property: "visible",
            value: false,
          },
          {
            type: "and",
            sources: [
              { name: "page", value: 1 },
              { name: "ID", value: 1 },
            ],
            property: "visible",
            value: true,
          },
        ],
      },
      {
        name: "SMODEL",
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 2 },
              { name: "IDMODEL", value: "Иное" },
            ],
            property: "visible",
            value: true,
          },
        ],
      },
      {
        name: "SBODYNUMBER",
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 2 },
              { name: "BNO_VIN", value: "Да" },
            ],
            property: "visible",
            value: true,
          },
        ],
      },
    ],
  },
  event: {
    fields: [
      {
        name: "IDBRAND",
        type: "changed",
        conditions: [
          {
            type: "and",
            sources: [{ name: "name", value: "IDMODEL" }],
            property: "visible",
            value: true,
          },
        ],
      },
      {
        name: "SMODEL",
        type: "computed",
        fields: ["IDMODEL", "IDBRAND"],
        conditions: [
          {
            type: "and",
            sources: [
              { name: "name", value: "IDMODEL" },
              { name: "name", value: "IDBRAND" },
            ],
            property: "value",
          },
        ],
      },
      {
        name: "BUTTON_NEXT",
        type: "computed",
        pages: [2],
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 2 },
              { name: "state", value: true },
              { name: "visible", value: true },
            ],
            property: "visible",
          },
        ],
      },
      {
        name: "BUTTON_NEXT",
        type: "clicked",
        conditions: [
          {
            type: "and",
            sources: [{ name: "page", value: 3 }],
            property: "visible",
            value: true,
          },
          {
            type: "and",
            sources: [{ name: "page", value: 2 }],
            property: "visible",
            value: false,
          },
        ],
      },
      {
        name: "BUTTON_NEXT_POLICYHOLDER",
        type: "clicked",
        conditions: [
          {
            type: "and",
            sources: [{ name: "page", value: 4 }],
            property: "visible",
            value: true,
          },
          {
            type: "and",
            sources: [{ name: "page", value: 3 }],
            property: "visible",
            value: false,
          },
        ],
      },
      {
        name: "SBODYNUMBER",
        type: "computed",
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 2 },
              { name: "BNO_VIN", value: true },
            ],
            property: "visible",
          },
        ],
      },
      {
        name: "SVIN",
        type: "computed",
        conditions: [
          {
            type: "and",
            sources: [
              { name: "page", value: 2 },
              { name: "BNO_VIN", value: false },
            ],
            property: "visible",
          },
        ],
      },
      {
        name: "LISOWNER",
        type: "notEquals",
        conditions: [
          {
            type: "and",
            sources: [{ name: "page", value: 4 }],
            property: "visible",
          },
        ],
      },
    ],
  },
};
