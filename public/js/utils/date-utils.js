const MONTH_NAMES = [];
const LEAP_YEAR_MONTH_LENGTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (let i = 0; i < 12; i++) {
    MONTH_NAMES.push(new Date(2023, i, 1).toLocaleString(undefined, { month: 'long' }));
}
function addToDate(date, days = 0) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}
function getMmDd(date) {
    return getMmDdFromString(getFormattedDate(date));
}
function getMmDdFromString(date) {
    return date.split('-').slice(1).join('-'); // remove year from date string
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
function getShorthandedMonthAndDay(date) {
    return date.toLocaleDateString(navigator.language, { month: 'short', day: 'numeric' });
}
function isDateStringValid(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString))
        return false;
    const [, month, day] = dateString.split('-').map(i => +i);
    if (month < 1 || month > 12)
        return false;
    if (day < 1 || day > 31)
        return false;
    const date = new Date(dateString);
    if (Number(month) !== (date.getMonth() + 1))
        return false;
    return true;
}
function isLeapYear(date) {
    return date.getFullYear() % 4 === 0;
}
function isFirstDateBeforeSecondDate(now, date) {
    return now < date;
}
function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}
export { MONTH_NAMES, LEAP_YEAR_MONTH_LENGTH, addToDate, getFormattedDate, getDateFromURL, getDisplayableDate, getShorthandedDayOfTheWeekName, getShorthandedMonthAndDay, getMmDd, getMmDdFromString, isDateStringValid, isLeapYear, isFirstDateBeforeSecondDate, isSameDate };
