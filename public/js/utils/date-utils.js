function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function getDateFromURL(urlSearchParamString) {
    return new URLSearchParams(urlSearchParamString).get("day") || getFormattedDate(new Date());
}
function getDisplayableDate(date) {
    return date.toLocaleDateString(navigator.language);
}
function addToDate(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return getFormattedDate(date);
}
export { getFormattedDate, getDateFromURL, getDisplayableDate, addToDate };
