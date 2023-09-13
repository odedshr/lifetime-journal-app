function getFormattedDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getDateFromURL(urlSearchParamString: string) {
  return new URLSearchParams(urlSearchParamString).get("day") || getFormattedDate(new Date());
}

function getDisplayableDate(date: Date) {
  return date.toLocaleDateString(navigator.language);
}

function addToDate(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days)
  return getFormattedDate(date);
}

export { getFormattedDate, getDateFromURL, getDisplayableDate, addToDate };