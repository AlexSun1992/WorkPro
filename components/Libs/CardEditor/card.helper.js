const CARDS_FOR_LOCAL_SCRIPT = [
  "1100",
  "1101",
  "1102",
  "1105",
  "1106",
  "1107",
  "1039",
  "1093",
  "1095",
  "1096",
  "1102",
  "1097",
  "1098",
  "1124",
  "1125",
  "1127",
  "1142",
];

function hasLocalScript(id) {
  return CARDS_FOR_LOCAL_SCRIPT.includes(id);
}

export { hasLocalScript };
