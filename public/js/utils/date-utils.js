function addToDate(date, days = 0) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function getDateFromURL(urlSearchParamString) {
    const day = new URLSearchParams(urlSearchParamString).get("day");
    try {
        return getFormattedDate(day ? new Date(day) : new Date());
    }
    catch (e) { // bad date provided
        return getFormattedDate(new Date());
    }
}
function getDisplayableDate(date) {
    return date.toLocaleDateString(navigator.language);
}
function getShorthandedDayOfTheWeekName(date) {
    return date.toLocaleDateString(navigator.language, { weekday: 'short' });
}
export { addToDate, getFormattedDate, getDateFromURL, getDisplayableDate, getShorthandedDayOfTheWeekName };
