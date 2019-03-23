"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const Analytics_1 = require("./Analytics/Analytics");
const Notifications_1 = require("./Notifications");
const Tests_1 = require("./Tests");
const Auth_1 = require("./Auth");
const Assemblies_1 = require("./Analytics/Assemblies");
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
exports.analyticsOnAdd = functions.firestore
    .document(`${Constants_1.REF_REPORTS}/{dcId}`)
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const category = snap.get(Constants_1.FIELD_CATEGORY);
    const sup = snap.get(Constants_1.FIELD_SUP_CODE);
    const status = snap.get(Constants_1.CASE_STATUS);
    try {
        return Analytics_1.statusDidUpdated(sup, category, category, status, status);
    }
    catch (e) {
        console.log("Error happened with sig: ", e);
        return Promise.reject(e);
    }
}));
exports.reportWasUpdated = functions.firestore
    .document(`${Constants_1.REF_REPORTS}/{dcId}`)
    .onUpdate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const befdoc = snap.before;
    const after = snap.after;
    const uid = befdoc.get("uid");
    const oldstatus = befdoc.get(Constants_1.CASE_STATUS);
    const newstatus = after.get(Constants_1.CASE_STATUS);
    const oldcat = befdoc.get(Constants_1.FIELD_CATEGORY);
    const afcat = after.get(Constants_1.FIELD_CATEGORY);
    const sup = after.get(Constants_1.FIELD_SUP_CODE);
    const ts = after.get("ts");
    const month = Constants_1.returnMonthYear(ts);
    try {
        // if (oldcat !== afcat) {
        //   updatedCategory(oldcat, month, afcat, oldstatus, sup);
        // }
        // if (oldstatus !== newstatus) {
        //   statusWasUpdated(oldcat, month, sup, afcat, oldstatus, newstatus);
        // }
        const resp = yield Analytics_1.statusDidUpdated(sup, oldcat, afcat, oldstatus, newstatus);
        return Notifications_1.sendNotification(store, uid, after, admin.messaging(), sup);
    }
    catch (e) {
        //const ref:admin.firestore.Query = admin.firestore().collection('').where()
        console.log("Error occurred with signature", e);
        return Promise.reject(e);
    }
}));
exports.deletedDocument = functions.firestore
    .document(`${Constants_1.REF_REPORTS}/{docId}`)
    .onDelete((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const status = snap.get(Constants_1.CASE_STATUS);
    const category = snap.get(Constants_1.FIELD_CATEGORY);
    const supcode = snap.get(Constants_1.FIELD_SUP_CODE);
    try {
        return Analytics_1.documentDeleted(status, category, supcode);
    }
    catch (e) {
        console.log("Error occurred with sig: ", e);
        return Promise.reject(e);
    }
}));
exports.performAnalyticsOnAll = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    return Analytics_1.performAnalyticsOnAllDocs(response);
}));
exports.addAuthorityAccount = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    return Auth_1.createAuthority(store, corsHandler, request, response, admin);
}));
function fetchDocBy(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin
            .firestore()
            .doc(uid)
            .get();
    });
}
exports.resetToZero = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    return Analytics_1.resetAnalyticsToZero(response);
    //const r = getWeekNumber(new Date());
    //console.log(date+' The week stuff are',r);
}));
exports.test_addDuplicates = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    return Tests_1.testDuplicates(store, response);
}));
exports.alignAuths = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    //const batch = store.batch();
    // for (const key in AssemblyKeys) {
    //   data.push(key);
    // }
    const data = [];
    for (const key in Assemblies_1.AssemblyKeys) {
        data.push(key);
    }
    const resp = yield store
        .collection(Constants_1.REF_AUTHORITIES)
        .doc("yXG7QRkYBzS8nZUUZqzyZyGz4wI2")
        .update({ region: data });
    return response.status(200).send(resp);
}));
exports.listAllAnonymous = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    let nextPageToken = "next";
    try {
        const list = yield admin.auth().listUsers(1000, nextPageToken);
        const data = [];
        for (const user of list.users) {
            if (user.providerData.length === 0) {
                const del = yield admin.auth().deleteUser(user.uid);
                data.push(del);
            }
        }
        response.status(200).send(data);
    }
    catch (e) {
        response.status(500).send(e);
    }
}));
//# sourceMappingURL=index.js.map