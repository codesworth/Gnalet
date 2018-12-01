import {
  REF_REPORTS,
  FIELD_CATEGORY,
  CASE_STATUS,
  FIELD_SUPBODY,
  returnMonthYear
} from "./Constants";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import {
  performAnalyticsOnAdd,
  updatedCategory,
  statusWasUpdated,
  documentDeleted,
  performAnalyticsOnAllDocs,
  resetAnalyticsToZero
} from "./Analytics";
import { sendNotification } from "./Notifications";
import { testDuplicates } from "./Tests";
import { createAuthority } from "./Auth";

//const cors = require('cors')({origin: true});

admin.initializeApp();
const store = admin.firestore();

const rsettings = { timestampsInSnapshots: true };
store.settings(rsettings);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const corsHandler = cors({ origin: true });
//const corsHandler = cors({origin:true});

export const analyticsOnAdd = functions.firestore
  .document(`${REF_REPORTS}/{dcId}`)
  .onCreate(async (snap, context) => {
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);
    const month = returnMonthYear(null);
    try {
      return performAnalyticsOnAdd(category, month, sup);
    } catch (e) {
      console.log("Error happened with sig: ", e);
      return Promise.reject(e);
    }
  });

export const reportWasUpdated = functions.firestore
  .document(`${REF_REPORTS}/{dcId}`)
  .onUpdate(async (snap, context) => {
    const befdoc = snap.before;
    const after = snap.after;
    const uid = befdoc.get("uid");
    const oldstatus: number = befdoc.get(CASE_STATUS);
    const newstatus: number = after.get(CASE_STATUS);
    const oldcat = befdoc.get(FIELD_CATEGORY);
    const afcat = after.get(FIELD_CATEGORY);
    const sup = after.get(FIELD_SUPBODY);
    const ts = after.get("ts");
    const month = returnMonthYear(ts);
    try {
      if (oldcat !== afcat) {
        updatedCategory(oldcat, month, afcat, oldstatus, sup);
      }
      if (oldstatus !== newstatus) {
        statusWasUpdated(oldcat, month, sup, afcat, oldstatus, newstatus);
      }
      return sendNotification(store, uid, after, admin.messaging(), sup);
    } catch (e) {
      //const ref:admin.firestore.Query = admin.firestore().collection('').where()
      console.log("Error occurred with signature", e);
      return Promise.reject(e);
    }
  });

export const deletedDocument = functions.firestore
  .document(`${REF_REPORTS}/{docId}`)
  .onDelete(async (snap, context) => {
    const status = snap.get(CASE_STATUS);
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);

    try {
      return documentDeleted(status, store, category, sup);
    } catch (e) {
      console.log("Error occurred with sig: ", e);
      return Promise.reject(e);
    }
  });

export const performAnalyticsOnAll = functions.https.onRequest(
  async (request, response) => {
    return performAnalyticsOnAllDocs(store, response);
  }
);

export const addAuthorityAccount = functions.https.onRequest(
  async (request, response) => {
    return createAuthority(store, corsHandler, request, response, admin);
  }
);

async function fetchDocBy(uid: string) {
  return admin
    .firestore()
    .doc(uid)
    .get();
}

export const resetToZero = functions.https.onRequest(
  async (request, response) => {
    return resetAnalyticsToZero(store, response);
    //const r = getWeekNumber(new Date());
    //console.log(date+' The week stuff are',r);
  }
);

export const test_addDuplicates = functions.https.onRequest(
  async (request, response) => {
    return testDuplicates(store, response);
  }
);
