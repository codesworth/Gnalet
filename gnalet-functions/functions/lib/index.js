"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
//import * as cors from "cors";
const Analytics_1 = require("./Analytics/Analytics");
const Notifications_1 = require("./Notifications");
const Tests_1 = require("./Tests");
const Regions_1 = require("./Analytics/Regions");
admin.initializeApp();
exports.store = admin.firestore();
const rsettings = { timestampsInSnapshots: true };
exports.store.settings(rsettings);
//const corsHandler = cors({ origin: true });
//const corsHandler = cors({origin:true});
exports.analyticsOnAdd = functions.firestore
    .document(`${Constants_1.REF_REPORTS}/{dcId}`)
    .onCreate(async (snap, context) => {
    try {
        return Analytics_1.analyse(snap, null);
    }
    catch (e) {
        console.log("Error happened with sig: ", e);
        return Promise.reject(e);
    }
});
exports.reportWasUpdated = functions.firestore
    .document(`${Constants_1.REF_REPORTS}/{dcId}`)
    .onUpdate(async (snap, context) => {
    const befdoc = snap.before;
    const after = snap.after;
    const uid = befdoc.get("uid");
    const oldstatus = befdoc.get(Constants_1.FIELD_STATUS);
    const newstatus = after.get(Constants_1.FIELD_STATUS);
    const sup = after.get(Constants_1.FIELD_SUPBODY);
    const oldcat = befdoc.get(Constants_1.FIELD_CATEGORY);
    const afcat = after.get(Constants_1.FIELD_CATEGORY);
    try {
        if (oldstatus === newstatus && oldcat === afcat) {
            return Promise.resolve("Nothing");
        }
        //const promises:any = [];
        const resp = Analytics_1.analyse(after, befdoc);
        const notif = Notifications_1.sendNotification(exports.store, uid, after, admin.messaging(), sup);
        return Promise.all([resp, notif]);
    }
    catch (e) {
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
exports.test_addDuplicates = functions.https.onRequest(async (request, response) => {
    return Tests_1.testDuplicates(exports.store, response);
});
exports.alignAuths = functions.https.onRequest(async (request, response) => {
    //const batch = store.batch();
    // for (const key in AssemblyKeys) {
    //   data.push(key);
    // }
    const data = [];
    for (const key in Regions_1.Regions) {
        data.push(key);
    }
    const resp = await exports.store
        .collection(Constants_1.REF_AUTHORITIES)
        .doc("yXG7QRkYBzS8nZUUZqzyZyGz4wI2")
        .update({ region: data });
    return response.status(200).send(resp);
});
//# sourceMappingURL=index.js.map