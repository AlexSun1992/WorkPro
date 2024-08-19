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
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthsList[date.getMonth()];

  return `${day} ${month}`;
}
