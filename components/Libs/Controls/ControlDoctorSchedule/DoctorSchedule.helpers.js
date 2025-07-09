export function formattedDate(dateString) {
  const monthsList = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const monthsNumberList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthsNumberList[date.getMonth()];

  return `${day}.${month}`;
}
