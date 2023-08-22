export function formattedNumber(num) {
  return new Intl.NumberFormat("ru-RU").format(num);
}
