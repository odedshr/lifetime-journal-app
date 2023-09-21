function addToDate(date: Date, days: number = 0) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDateFromURL(urlSearchParamString: string) {
  const day = new URLSearchParams(urlSearchParamString).get("day") as string;
  try {
    return getFormattedDate(day ? new Date(day) : new Date());
  }
  catch (e) { // bad date provided
    return getFormattedDate(new Date());
  }
}

function getDisplayableDate(date: Date) {
  return date.toLocaleDateString(navigator.language);
}

function getShorthandedDayOfTheWeekName(date: Date) {
  return date.toLocaleDateString(navigator.language, { weekday: 'short' });
}

export { addToDate, getFormattedDate, getDateFromURL, getDisplayableDate, getShorthandedDayOfTheWeekName };