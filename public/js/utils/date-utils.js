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
function addToDate(dateString, days = 0) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return getFormattedDate(date);
}
export { getFormattedDate, getDateFromURL, getDisplayableDate, addToDate };
