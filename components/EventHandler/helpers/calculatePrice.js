import { findField } from "./findField";

export function getAdditionalOptions(data, optionsName) {
  const IMSOPTIONS = findField(data, optionsName);

  const selectedOptions = typeof IMSOPTIONS?.value === "string" ? JSON.parse(IMSOPTIONS.value) : IMSOPTIONS?.value;

  const clearedOptions = { price: 0, options: [] };

  if (Array.isArray(selectedOptions)) {
    const options = new Map((IMSOPTIONS.options || []).map((option) => [String(option.ID), option]));

    return selectedOptions.reduce((acc, id) => {
      const option = options.get(String(id));
      if (option) {
        const price = option.NPRICE || 0;
        acc.price += Number(price);
        acc.options.push(option.DYNAMICTEXT);
      }
      return acc;
    }, clearedOptions);
  }
  return clearedOptions;
}

export function calculatePrice(data, costName = "NCOST", optionsName = "IMSOPTIONS") {
  const NCOST = findField(data, costName);
  let basePrice = 0;

  if (NCOST && Array.isArray(NCOST.options)) {
    const raw = NCOST?.options?.[0]?.value;
    const parsed = Number(raw);
    basePrice = Number.isFinite(parsed) ? parsed : 0;
  }

  const { options, price } = getAdditionalOptions(data, optionsName);

  return { fullPrice: basePrice + price, additional: options };
}
