const CARDS_FOR_LOCAL_SCRIPT = [
  "1037",
  "1038",
  "1039",
  "1040",
  "1041",
  "1068",
  "1069",
  "1093",
  "1095",
  "1096",
  "1097",
  "1098",
  "1100",
  "1101",
  "1102",
  "1105",
  "1106",
  "1107",
  "1124",
  "1125",
  "1127",
  "1134",
  "1141",
  "1142",
  "1154",
  "1219",
  "1220",
  "1221",
  "1222",
  "1223",
  "1228",
];

function hasLocalScript(id) {
  return CARDS_FOR_LOCAL_SCRIPT.includes(id);
}

export { hasLocalScript };
