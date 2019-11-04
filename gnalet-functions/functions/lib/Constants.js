"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_OPTIONS = "OPTIONS";
exports.REF_REPORTERS = "GN-REPORTERS";
exports.REF_DUMMY_HOLDER = "AUTHHOLDER";
exports.REF_REPORTS = "GN-REPORTS";
exports.REF_AUTHORITIES = "GN-Authorities";
exports.REF_TOKENS = "TOKENS";
exports.REF_ANALYTICS = "GN-ANALYTICS";
exports.REF_ANALYTICS_YEAR = "GN-Year";
exports.REF_ANALYTICS_DAY_OF_YEAR = "GN-DayOfYear";
exports.FIELD_SUPBODY = "supBody";
exports.FIELD_CATEGORY = "category";
exports.FIELD_SUP_CODE = "sup_code";
exports.FIELD_UNSOLVED = "unsolved";
exports.FIELD_SOLVED = "solved";
exports.FIELD_DUPLICATE = "duplicate";
exports.FIELD_PENDING = "pending";
exports.FIELD_FLAGGED = "flag";
exports.VEHICULAR = "VEHICULAR";
exports.SANITATION = "SANITATION";
exports.CRIMES = "CRIMES";
exports.REF_MONTHS = "Months";
exports.WATER = "WATER";
exports.POTHOLES = "POTHOLES";
exports.ECG = "ECG";
exports.HFDA = "HFDA";
exports.OTHERS = "OTHERS";
exports.GSA = "GSA";
exports.FIELD_DAY_OF_YEAR = "dayOfYear";
exports.FIELD_YEAR = "year";
exports.FIELD_EMAIL = "email";
exports.FIELD_PHONE = "phone";
exports.FIELD_DESC = "description";
exports.FIELD_LOCATION = "location";
exports.FIELD_LONGITUDE = "longitude";
exports.FIELD_LATITUDE = "latitude";
exports.FIELD_IMGLNK = "link";
exports.FIELD_SUP_BODY = "supBody";
exports.FIELD_STATUS = "status";
exports.FIELD_REPORTER = "Reporter";
exports.FIELD_UP_VOTES = "ups";
exports.FIELD_DOWN_VOTES = "downs";
exports.USER_UID__ = "uid";
exports.DID_LOG_IN_ = "LoggedIn";
exports.REF_ID_USERNAME = "username";
exports.REF_ID_IMG_LNK = "link";
exports.REF_GC_POINTS = "gcpoints";
exports._DATE = "date";
function getStatusString(status) {
    switch (status) {
        case 0:
            return exports.FIELD_UNSOLVED;
        case 1:
            return exports.FIELD_PENDING;
        case 2:
            return exports.FIELD_SOLVED;
        case 3:
            return exports.FIELD_FLAGGED;
        case 4:
            return exports.FIELD_DUPLICATE;
        default:
            return "";
    }
}
exports.getStatusString = getStatusString;
function returnMonthYear(ts) {
    let date;
    if (ts === null) {
        date = new Date();
    }
    else {
        date = new Date(ts);
    }
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const val = String(year)
        .concat("-")
        .concat(String(month));
    return val;
}
exports.returnMonthYear = returnMonthYear;
function getWeekNumber(d) {
    // Copy date so don't modify original
    //d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    console.log(d);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}
exports.getWeekNumber = getWeekNumber;
function helperAccess(access) {
    if (access === "1000") {
        return 1000;
    }
    else if (access === "1020") {
        return 1020;
    }
    else if (access === "2000") {
        return 2000;
    }
    else {
        return 1000;
    }
}
exports.helperAccess = helperAccess;
//# sourceMappingURL=Constants.js.map