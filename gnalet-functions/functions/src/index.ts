import {
  REF_REPORTS,
  FIELD_CATEGORY,
  FIELD_STATUS,
  REF_AUTHORITIES,
  FIELD_SUPBODY
} from "./Constants";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
//import * as cors from "cors";
import { analyse } from "./Analytics/Analytics";
import { sendNotification } from "./Notifications";
import { testDuplicates } from "./Tests";

import { Regions } from "./Analytics/Regions";

admin.initializeApp();
export const store = admin.firestore();

const rsettings = { timestampsInSnapshots: true };
store.settings(rsettings);

//const corsHandler = cors({ origin: true });
//const corsHandler = cors({origin:true});

export const analyticsOnAdd = functions.firestore
  .document(`${REF_REPORTS}/{dcId}`)
  .onCreate(async (snap, context) => {
    try {
      return analyse(snap, null);
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
    const oldstatus: number = befdoc.get(FIELD_STATUS);
    const newstatus: number = after.get(FIELD_STATUS);
    const sup = after.get(FIELD_SUPBODY);
    const oldcat = befdoc.get(FIELD_CATEGORY);
    const afcat = after.get(FIELD_CATEGORY);
    try {
      if (oldstatus === newstatus && oldcat === afcat) {
        return Promise.resolve("Nothing");
      }
      //const promises:any = [];
      const resp = analyse(after, befdoc);
      const notif = sendNotification(store, uid, after, admin.messaging(), sup);
      return Promise.all([resp, notif]);
    } catch (e) {
      //const ref:admin.firestore.Query = admin.firestore().collection('').where()
      console.log("Error occurred with signature", e);
      return Promise.reject(e);
    }
  });

/*
export const deletedDocument = functions.firestore
  .document(`${REF_REPORTS}/{docId}`)
  .onDelete(async (snap, context) => {
    const status = snap.get(FIELD_STATUS);
    const category = snap.get(FIELD_CATEGORY);
    const supcode = snap.get(FIELD_SUP_CODE);

    try {
      return documentDeleted(status, category, supcode);
    } catch (e) {
      console.log("Error occurred with sig: ", e);
      return Promise.reject(e);
    }
  });

export const performAnalyticsOnAll = functions.https.onRequest(
  async (request, response) => {
    return performAnalyticsOnAllDocs(response);
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
    return resetAnalyticsToZero(response);
    //const r = getWeekNumber(new Date());
    //console.log(date+' The week stuff are',r);
  }
);*/

export const test_addDuplicates = functions.https.onRequest(
  async (request, response) => {
    return testDuplicates(store, response);
  }
);

export const alignAuths = functions.https.onRequest(
  async (request, response) => {
    //const batch = store.batch();

    // for (const key in AssemblyKeys) {
    //   data.push(key);
    // }
    const data = [];
    for (const key in Regions) {
      data.push(key);
    }
    const resp = await store
      .collection(REF_AUTHORITIES)
      .doc("yXG7QRkYBzS8nZUUZqzyZyGz4wI2")
      .update({ region: data });
    return response.status(200).send(resp);
  }
);
