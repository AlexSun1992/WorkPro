const CARDS_FOR_LOCAL_SCRIPT = [
  "1105",
  "1106",
  "1107",
  "1093",
  "1095",
  "1096",
  "1097",
  "1098",
];

function hasLocalScript(id) {
  return CARDS_FOR_LOCAL_SCRIPT.includes(id);
}

export { hasLocalScript };
