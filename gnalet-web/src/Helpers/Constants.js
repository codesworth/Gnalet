import * as moment from "moment";
import { Regions } from "../Helpers/Assemblies";

export const URL_ADD_AUTH =
  "https://us-central1-gnalet-e91c4.cloudfunctions.net/addAuthorityAccount";
export const REF_REPORTERS = "GN-REPORTERS";
export const REF_DUMMY_HOLDER = "AUTHHOLDER";
export const EVENTS_DOC = "GN-EVENTS";
export const REF_UTILS = "GN-UTILITIES";
export const REF_MONTHS = "Months";
export const REF_REPORTS = "GN-REPORTS";
export const REF_AUTHORITIES = "GN-Authorities";
export const REF_TOKENS = "TOKENS";
export const REF_ANALYTICS = "GN-ANALYTICS";
export const DOC_ALL_REPORTS = "GN-AllReports";
export const REF_ANALYTICS_YEAR = "GN-Year";
export const REF_ANALYTICS_DAY_OF_YEAR = "GN-DayOfYear";
export const FIELD_SUPBODY = "supBody";
export const FIELD_CATEGORY = "category";
export const FIELD_UNSOLVED = "unsolved";
export const FIELD_FEEDBACK = "feedback";
export const FIELD_LOCALITY = "locality";
export const FIELD_SOLVED = "solved";
export const FIELD_ACCESS_CODE = "access";
export const FIELD_PENDING = "pending";
export const FIELD_FLAGGED = "flag";
export const VEHICULAR = "VEHICULAR";
export const SANITATION = "SANITATION";
export const CRIMES = "CRIMES";
export const REF_FEEDBACK = "USERFEEDBACK";
export const FIELD_SUPCODE = "sup_code";
export const WATER = "WATER";
export const POTHOLES = "POTHOLES";
export const ECG = "ECG";
export const HFDA = "HFDA";
export const OTHERS = "OTHERS";
export const QUERY_LIMIT = 20;
export const GSA = "GSA";
export const COVID_19 = "COVID-19";
export const COVID_SOCIAL = "SOCIAL-DISTANCING";
export const FIELD_DUPLICATE = "duplicate";
export const CASE_EMAIL = "email";
export const CASE_PHONE = "phone";
export const CASE_DESC = "description";
export const CASE_LOCATION = "location";
export const FIELD_LONGITUDE = "longitude";
export const FIELD_LATITUDE = "latitude";
export const CASE_IMGLNK = "link";
export const CASE_SUP_BODY = "supBody";
export const CASE_STATUS = "status";
export const CASE_REPORTER = "Reporter";
export const CASE_UP_VOTES = "ups";
export const CASE_DOWN_VOTES = "downs";
export const USER_UID__ = "uid";
export const DID_LOG_IN_ = "LoggedIn";
export const REF_ID_USERNAME = "username";
export const REF_ID_IMG_LNK = "link";
export const REF_GC_POINTS = "gcpoints";
export const _DATE = "date";
export const ACCESS_CODE_EDIT = 1020;
export const ACCESS_CODE_READ = 1000;
export const ACCESS_CODE_MASTER = 2000;
export const USER_SETTINGS = "userSettings";
export const AN_YEAR_DATA = "yearly";
export const AN_ADMIN_AREA_DATA = "area";
export const AN_CATEGORICAL = "categories";
export const AN_TOTALS = "totals";
export const REF_GNALET_CLIENT = "GN-CLIENTS";
export const CLIENT_KEY = "backendkey";
export const FIELD_DAY_OF_YEAR = "dayOfYear";

export const category_ids = [
  "ALL",
  "COVID-19",
  "SOCIAL-DISTANCING",
  "VEHICULAR",
  "SANITATION",
  "CRIMES",
  "WATER",
  "POTHOLES",
  "ECG",
  "HFDA",
  "GSA",
  "OTHERS",
  "INDISCIPLINE",
];

export const regionArray = [
  "ALL",
  "OR",
  "BER",
  "AHR",
  "BR",
  "NER",
  "SR",
  "WNR",
  "WR",
  "VR",
  "GAR",
  "ER",
  "AR",
  "CR",
  "NR",
  "UER",
  "UWR",
];

export function formatDate(date) {
  var md = moment(date).format("MM/DD/YY, h:mm:ss a");
  return md;
}

export function getStatusFromCode(status) {
  switch (status) {
    case 0:
      return "Unsolved";
    case 1:
      return "Pending";
    case 2:
      return "Solved";
    default:
      return "Flagged";
  }
}

export function facingCategoryname(symlnk) {
  switch (symlnk) {
    case "ALL":
      return "All Categories";
    case "COVID-19":
      return "COVID-19 (Corona Virus)";
    case "SOCIAL-DISTANCING":
      return "COVID-19 Social Distancing Violation";
    case "VEHICULAR":
      return "Accidents/Vehicular";
    case "CRIMES":
      return "Criminal Activities";
    case "SANITATION":
      return "Sanitation";
    case "POTHOLES":
      return "Potholes";
    case "ECG":
      return "Electricity/ECG";
    case "WATER":
      return "Pipes/Water";
    case "HFDA":
      return "Food/Drugs Board";
    case "GSA":
      return "Ghana Standards Authority";
    case "INDISCIPLINE":
      return "Indiscipline Behaviour";
    default:
      return "OTHERS";
  }
}

export function publicFacingRegion(region) {
  const asm =
    typeof Regions[region] === "string" ? Regions[region] : "All Regions";
  return asm;
}

export function returnMonthYear(ts) {
  let date;
  if (ts === null) {
    date = new Date();
  } else {
    date = new Date(ts);
  }
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const val = String(year).concat("-").concat(String(month));
  return val;
}

// export const Regions = {
//   OR: "Oti Region",
//   BER: "Bono East Region",
//   AHR: "Ahafo Region",
//   BR: "Bono Region",
//   NER: "North East Region",
//   SR: "Savannah Region",
//   WNR: "Western North Region",
//   WR: "Western Region",
//   VR: "Volta Region",
//   GAR: "Greater Accra Region",
//   ER: "Eastern Region",
//   AR: "Ashanti Region",
//   CR: "Central Region",
//   NR: "Northern Region",
//   UER: "Upper East Region",
//   UWR: "Upper West Region"
// };
