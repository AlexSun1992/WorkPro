import { mask } from "vue-the-mask";

export const applyMask = {
  bind(el, binding) {
    if (binding.value && binding.value !== "") {
      mask(el, binding);
    }
  },
  unbind() {},
};

export function changeKeyboardLayout(str) {
  const replacer = {
    q: "й",
    w: "ц",
    e: "у",
    r: "к",
    t: "е",
    y: "н",
    u: "г",
    i: "ш",
    o: "щ",
    p: "з",
    "[": "х",
    "]": "ъ",
    a: "ф",
    s: "ы",
    d: "в",
    f: "а",
    g: "п",
    h: "р",
    j: "о",
    k: "л",
    l: "д",
    ";": "ж",
    "'": "э",
    z: "я",
    x: "ч",
    c: "с",
    v: "м",
    b: "и",
    n: "т",
    m: "ь",
    ",": "б",
    ".": "ю",
    "/": ".",
  };

  return str.replace(/[A-z/,.;\'\]\[]/g, (x) =>
    x == x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()
  );
}
