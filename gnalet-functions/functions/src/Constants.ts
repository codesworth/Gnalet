export const REQUEST_OPTIONS = "OPTIONS";
export const REF_REPORTERS = "GN-REPORTERS";
export const REF_DUMMY_HOLDER = "AUTHHOLDER";
export const REF_REPORTS = "GN-REPORTS";
export const REF_AUTHORITIES = "GN-Authorities";
export const REF_TOKENS = "TOKENS";
export const REF_ANALYTICS = "GN-ANALYTICS";
export const REF_ANALYTICS_YEAR = "GN-Year";
export const REF_ANALYTICS_DAY_OF_YEAR = "GN-DayOfYear";
export const FIELD_SUPBODY = "supBody";
export const FIELD_CATEGORY = "category";
export const FIELD_SUP_CODE = "sup_code";
export const FIELD_UNSOLVED = "unsolved";
export const FIELD_SOLVED = "solved";
export const FIELD_DUPLICATE = "duplicate";
export const FIELD_PENDING = "pending";
export const FIELD_FLAGGED = "flag";
export const VEHICULAR = "VEHICULAR";
export const SANITATION = "SANITATION";
export const CRIMES = "CRIMES";
export const REF_MONTHS = "Months";
export const WATER = "WATER";
export const POTHOLES = "POTHOLES";
export const ECG = "ECG";
export const HFDA = "HFDA";
export const COVID_19 = "COVID-19";
export const COVID_SOCIAL = "SOCIAL-DISTANCING";
export const OTHERS = "OTHERS";
export const GSA = "GSA";
export const FIELD_DAY_OF_YEAR = "dayOfYear";
export const FIELD_YEAR = "year";
export const FIELD_EMAIL = "email";
export const FIELD_PHONE = "phone";
export const FIELD_DESC = "description";
export const FIELD_LOCATION = "location";
export const FIELD_LONGITUDE = "longitude";
export const FIELD_LATITUDE = "latitude";
export const FIELD_IMGLNK = "link";
export const FIELD_SUP_BODY = "supBody";
export const FIELD_STATUS = "status";
export const FIELD_REPORTER = "Reporter";
export const FIELD_UP_VOTES = "ups";
export const FIELD_DOWN_VOTES = "downs";
export const USER_UID__ = "uid";
export const DID_LOG_IN_ = "LoggedIn";
export const REF_ID_USERNAME = "username";
export const REF_ID_IMG_LNK = "link";
export const REF_GC_POINTS = "gcpoints";
export const _DATE = "date";

export function getStatusString(status: number): string {
  switch (status) {
    case 0:
      return FIELD_UNSOLVED;
    case 1:
      return FIELD_PENDING;
    case 2:
      return FIELD_SOLVED;
    case 3:
      return FIELD_FLAGGED;
    case 4:
      return FIELD_DUPLICATE;
    default:
      return "";
  }
}

export function returnMonthYear(ts?: number): string {
  let date;
  if (ts === null) {
    date = new Date();
  } else {
    date = new Date(ts!);
  }
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const val = String(year).concat("-").concat(String(month));
  return val;
}

export function getWeekNumber(d: any) {
  // Copy date so don't modify original
  //d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  console.log(d);

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

export function helperAccess(access: string) {
  if (access === "1000") {
    return 1000;
  } else if (access === "1020") {
    return 1020;
  } else if (access === "2000") {
    return 2000;
  } else {
    return 1000;
  }
}
