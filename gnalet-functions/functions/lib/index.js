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
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
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
const REQUEST_OPTIONS = "OPTIONS";
const REF_REPORTERS = "GN-REPORTERS";
const REF_DUMMY_HOLDER = "AUTHHOLDER";
const REF_REPORTS = "GN-REPORTS";
const REF_AUTHORITIES = "GN-Authorities";
const REF_TOKENS = "TOKENS";
const REF_ANALYTICS = "GN-ANALYTICS";
const FIELD_SUPBODY = "supBody";
const FIELD_CATEGORY = "category";
const FIELD_UNSOLVED = "unsolved";
const FIELD_SOLVED = "solved";
const FIELD_DUPLICATE = "duplicate";
const FIELD_PENDING = "pending";
const FIELD_FLAGGED = "flag";
const VEHICULAR = "VEHICULAR";
const SANITATION = "SANITATION";
const CRIMES = "CRIMES";
const REF_MONTHS = "Months";
const WATER = "WATER";
const POTHOLES = "POTHOLES";
const ECG = "ECG";
const HFDA = "HFDA";
const OTHERS = "OTHERS";
const GSA = "GSA";
const CASE_EMAIL = "email";
const CASE_PHONE = "phone";
const CASE_DESC = "description";
const CASE_LOCATION = "location";
const CASE_LONGITUDE = "longitude";
const CASE_LATITUDE = "latitude";
const CASE_IMGLNK = "link";
const CASE_SUP_BODY = "supBody";
const CASE_STATUS = "status";
const CASE_REPORTER = "Reporter";
const CASE_UP_VOTES = "ups";
const CASE_DOWN_VOTES = "downs";
const USER_UID__ = "uid";
const DID_LOG_IN_ = "LoggedIn";
const REF_ID_USERNAME = "username";
const REF_ID_IMG_LNK = "link";
const REF_GC_POINTS = "gcpoints";
const _DATE = "date";
exports.analyticsOnAdd = functions.firestore
    .document(`${REF_REPORTS}/{dcId}`)
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);
    const month = returnMonthYear(null);
    try {
        return admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const aref = admin.firestore().doc(`${REF_ANALYTICS}/${category}`);
            const mref = admin
                .firestore()
                .doc(`${REF_ANALYTICS}/${category}/${REF_MONTHS}/${month}`);
            const analyticdata = yield transaction.get(aref);
            const analyticmonth = yield transaction.get(mref);
            if (!analyticdata.exists) {
                throw { message: "Document data does not exist" };
            }
            const supdata = analyticdata.get(sup);
            const msupdata = analyticmonth.get(sup);
            const unsolved = supdata[FIELD_UNSOLVED];
            const munsolved = msupdata[FIELD_UNSOLVED] + 1;
            const newvalve = unsolved + 1;
            supdata[FIELD_UNSOLVED] = newvalve;
            msupdata[FIELD_UNSOLVED] = munsolved;
            transaction.update(aref, { [sup]: supdata });
            transaction.set(mref, { [sup]: msupdata }, { merge: true });
        }));
    }
    catch (e) {
        console.log("Error happened with sig: ", e);
        return Promise.reject(e);
    }
}));
exports.reportWasUpdated = functions.firestore
    .document(`${REF_REPORTS}/{dcId}`)
    .onUpdate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const befdoc = snap.before;
    const after = snap.after;
    const uid = befdoc.get("uid");
    const oldstatus = befdoc.get(CASE_STATUS);
    const newstatus = after.get(CASE_STATUS);
    const oldcat = befdoc.get(FIELD_CATEGORY);
    const afcat = after.get(FIELD_CATEGORY);
    const sup = after.get(FIELD_SUPBODY);
    const ts = after.get("ts");
    const month = returnMonthYear(ts);
    try {
        if (oldcat !== afcat) {
            yield admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                const aref = admin.firestore().doc(`${REF_ANALYTICS}/${oldcat}`);
                const mref = admin
                    .firestore()
                    .doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
                const newaref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
                const newmref = admin
                    .firestore()
                    .doc(`${REF_ANALYTICS}/${afcat}/${REF_MONTHS}/${month}`);
                const analyticdata = yield transaction.get(aref);
                const analyticmonth = yield transaction.get(mref);
                const newanalyticdata = yield transaction.get(newaref);
                const newanalyticmonth = yield transaction.get(newmref);
                const beforenum = analyticdata.get(sup)[getStatusString(oldstatus)] - 1;
                const mbeforenum = analyticmonth.get(sup)[getStatusString(oldstatus)] - 1;
                const afternum = newanalyticdata.get(sup)[getStatusString(oldstatus)] + 1;
                const mafternum = newanalyticmonth.get(sup)[getStatusString(oldstatus)] + 1;
                const upd = analyticdata.get(sup);
                const mupd = analyticmonth.get(sup);
                const newupd = newanalyticdata.get(sup);
                const newmupd = newanalyticmonth.get(sup);
                upd[getStatusString(oldstatus)] = beforenum;
                mupd[getStatusString(oldstatus)] = mbeforenum;
                newupd[getStatusString(oldstatus)] = afternum;
                newmupd[getStatusString(oldstatus)] = mafternum;
                transaction.update(aref, { [sup]: upd });
                transaction.update(mref, { [sup]: mupd });
                transaction.update(newmref, { [sup]: newmupd });
                transaction.update(newaref, { [sup]: newupd });
            }));
        }
        if (oldstatus !== newstatus) {
            yield admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                const aref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
                const mref = admin
                    .firestore()
                    .doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
                const analyticdata = yield transaction.get(aref);
                const analyticmonth = yield transaction.get(mref);
                const beforenum = analyticdata.get(sup)[getStatusString(oldstatus)] - 1;
                const afternum = analyticdata.get(sup)[getStatusString(newstatus)] + 1;
                const mbeforenum = analyticmonth.get(sup)[getStatusString(oldstatus)] - 1;
                const mafternum = analyticmonth.get(sup)[getStatusString(newstatus)] + 1;
                const upd = analyticdata.get(sup);
                const mupd = analyticmonth.get(sup);
                upd[getStatusString(oldstatus)] = beforenum;
                upd[getStatusString(newstatus)] = afternum;
                mupd[getStatusString(oldstatus)] = mbeforenum;
                mupd[getStatusString(newstatus)] = mafternum;
                transaction.update(mref, { [sup]: mupd });
                transaction.update(aref, { [sup]: upd });
            }));
        }
        const tokensnap = yield admin
            .firestore()
            .collection(REF_TOKENS)
            .doc(uid)
            .get();
        console.log("This is the token", tokensnap.data());
        if (!tokensnap.exists) {
            console.log("The token dont exist oo");
            return Promise.resolve("Nothing");
        }
        const token = tokensnap.data().token;
        console.log("Token is: ", token);
        const status = after.get("status");
        if (status === 1) {
            const message = {
                notification: {
                    title: "REPORT UPDATE",
                    body: `Your reported issue has been updated to Pending by the ${sup}`
                },
                token: token
            };
            return admin.messaging().send(message);
        }
        else if (status === 2) {
            const message = {
                notification: {
                    title: "REPORT UPDATE",
                    body: `Your reported issue has been Resolved`
                },
                token: token
            };
            return admin.messaging().send(message);
        }
        else if (status === 4) {
            const payload = {
                notification: {
                    title: "REPORT UPDATE",
                    body: `Your reported issue has been already filed and pending`
                }
            };
            return admin.messaging().sendToDevice(token, payload);
        }
        else {
            return Promise.resolve("Nothing");
        }
    }
    catch (e) {
        //const ref:admin.firestore.Query = admin.firestore().collection('').where()
        console.log("Error occurred with signature", e);
        return Promise.reject(e);
    }
}));
exports.deletedDocument = functions.firestore
    .document(`${REF_REPORTS}/{docId}`)
    .onDelete((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const status = snap.get(CASE_STATUS);
    const category = snap.get(FIELD_CATEGORY);
    const sup = snap.get(FIELD_SUPBODY);
    try {
        if (status === 3) {
            const analytic = yield store.doc(`${REF_ANALYTICS}/${category}`).get();
            const supdata = analytic.get(sup);
            const newflagnum = supdata[getStatusString(status)] - 1;
            supdata[getStatusString(status)] = newflagnum;
            const wr = yield store
                .doc(`${REF_ANALYTICS}/${category}`)
                .update({ [sup]: supdata });
            return Promise.resolve(wr);
        }
        else {
            return Promise.resolve();
        }
    }
    catch (e) {
        console.log("Error occurred with sig: ", e);
        return Promise.reject(e);
    }
}));
exports.addNewAuthorityAccount = functions.firestore
    .document(`${REF_DUMMY_HOLDER}/{docId}`)
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    const data = snapshot.get("data");
    const { email, password } = data;
    const batch = admin.firestore().batch();
    try {
        const res = yield admin
            .auth()
            .createUser({ email: email, password: password });
        batch.set(admin.firestore().doc(`${REF_AUTHORITIES}/${res.uid}`), data, {
            merge: true
        });
        batch.delete(snapshot.ref);
        const final = yield batch.commit();
        return Promise.resolve("Succesfully Added Authority User Account: " + final);
    }
    catch (e) {
        console.log("Error Occurred with sig: ", e);
        return Promise.reject(e);
    }
}));
exports.performAnalyticsOnAll = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const batch = store.batch();
    const allcats = {
        VEHICULAR: {},
        SANITATION: {},
        CRIMES: {},
        WATER: {},
        POTHOLES: {},
        ECG: {},
        HFDA: {},
        GSA: {},
        OTHERS: {}
    };
    const allmonths = {};
    try {
        const alldocs = yield store.collection(REF_REPORTS).get();
        alldocs.forEach(element => {
            const status = element.get(CASE_STATUS);
            const category = element.get(FIELD_CATEGORY);
            const region = element.get(CASE_SUP_BODY);
            let numb = 0;
            if (region in allcats[category]) {
                if (getStatusString(status) in allcats[category][region]) {
                    numb = allcats[category][region][getStatusString(status)];
                }
            }
            else {
                allcats[category][region] = {};
            }
            // if (allcats[category][region][getStatusString(status)] === undefined || allcats[category][region][getStatusString(status)] === 'undefined' || allcats[category][region][getStatusString(status)] === null){
            //     numb = 0;
            // }else{
            // }
            //= typeof(allcats[category][region][getStatusString(status)]) === 'number' ? allcats[category][region][getStatusString(status)] : 0
            console.log(`the studd are ${category} and ${region}`);
            allcats[category][region][getStatusString(status)] = numb + 1;
            const mid = returnMonthYear(element.get("ts"));
            let monthnumb = 0;
            if (mid in allcats[category]) {
                if (region in allcats[category][mid]) {
                    if (getStatusString(status) in allcats[category][mid][region]) {
                        monthnumb =
                            allcats[category][mid][region][getStatusString(status)];
                    }
                    else {
                        allcats[category][mid][region] = {};
                    }
                }
            }
            else {
                allcats[category][mid] = {
                    [region]: {}
                };
            }
            // if (allcats[category][mid][region][getStatusString(status)] === undefined || allcats[category][mid][region][getStatusString(status)] === 'undefined' || allcats[category][mid][region][getStatusString(status)] === null){
            //     monthnumb = 0;
            // }else{
            //     monthnumb = allcats[category][mid][region][getStatusString(status)];
            // }
            // typeof([category][mid][region][getStatusString(status)]) === 'number' ? allcats[category][mid][region][getStatusString(status)] : 0
            console.log(`the studd are ${category} adnn ${mid} and ${region}`);
            allcats[category][mid][region][getStatusString(status)] = monthnumb + 1;
        });
        for (const key in allcats) {
            const value = allcats[key];
            const gendata = {};
            const monthdata = {};
            for (const ikey in value) {
                if (ikey.length === 3) {
                    gendata[ikey] = value[ikey];
                }
                else {
                    monthdata[ikey] = value[ikey];
                }
            }
            batch.set(store.doc(`${REF_ANALYTICS}/${key}`), gendata, {
                merge: true
            });
            for (const id in monthdata) {
                const mref = store.doc(`${REF_ANALYTICS}/${key}/${REF_MONTHS}/${id}`);
                batch.set(mref, monthdata[id], { merge: true });
            }
        }
        const final = yield batch.commit();
        response.status(200).send(`Finished performing analytics:
        Write Time: ${final}`);
    }
    catch (e) {
        console.log("Error occurred with sig: ", e);
        //console.log("Object value ", allcats);
        response.status(504).send(`Error occurred with sig: ${e}`);
    }
}));
exports.addAuthorityAccount = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    corsHandler(request, response, () => {
        const { data } = request.body;
        const { email, password } = data;
        admin
            .auth()
            .createUser({ email: email, password: password })
            .then(res => {
            return admin
                .firestore()
                .doc(`${REF_AUTHORITIES}/${res.uid}`)
                .set(data, { merge: true });
        })
            .then(final => {
            response
                .status(200)
                .send("Succesfully Added Authority User Account: " + final);
        })
            .catch(e => {
            console.log("Error Occurred with sig: ", e);
            response.status(504).send(e);
        });
    });
}));
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
// https.onRequest(async (request, response) =>{
//     const supBody = request.params.supbody
//     const category = request.params.category;
//     try{
//         console.log(request.params);
//         const allqueries = await fireadmin.firestore().collection(REF_CASES).where("supBody", "==", supBody).where("name", "==", category).get();
//         const total = allqueries.docs.length;
//         response.status(200).send(total);
//     }
//     catch(err){
//         console.log("An error occurred with Signature: " + err);
//         response.status(404).send("Bad request, Invalid Params");
//     }
// })
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
function getWeekNumber(d) {
    // Copy date so don't modify original
    //d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    console.log(d);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}
function getStatusString(status) {
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
function fetchDocBy(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin
            .firestore()
            .doc(uid)
            .get();
    });
}
exports.resetToZero = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const date = returnMonthYear();
    const batch = admin.firestore().batch();
    //const r = getWeekNumber(new Date());
    //console.log(date+' The week stuff are',r);
    try {
        const data = {
            AMA: {
                unsolved: 0,
                pending: 0,
                solved: 0,
                flag: 0,
                duplicate: 0
            },
            TMA: {
                unsolved: 0,
                pending: 0,
                solved: 0,
                flag: 0,
                duplicate: 0
            }
        };
        const cats = [
            VEHICULAR,
            SANITATION,
            CRIMES,
            WATER,
            POTHOLES,
            ECG,
            HFDA,
            GSA,
            OTHERS
        ];
        cats.forEach(cat => {
            batch.set(admin.firestore().doc(`${REF_ANALYTICS}/${cat}`), data, {
                merge: true
            });
        });
        const years = [
            "2018-10",
            "2018-11",
            "2018-12",
            "2019-01",
            "2019-02",
            "2019-03",
            "2019-04",
            "2019-05",
            "2019-06",
            "2019-07",
            "2019-08",
            "2019-09",
            "2019-10"
        ];
        const docs = yield admin
            .firestore()
            .collection(REF_ANALYTICS)
            .get();
        docs.forEach(doc => {
            const id = doc.id;
            years.forEach(key => {
                let ref = admin
                    .firestore()
                    .collection(REF_ANALYTICS)
                    .doc(id)
                    .collection("Months")
                    .doc(key);
                batch.set(ref, data, { merge: true });
            });
        });
        const write = yield batch.commit();
        response.status(200).send(write);
    }
    catch (e) {
        console.log(e);
        response.status(504).send(e);
    }
}));
exports.test_addDuplicates = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const batch = store.batch();
    const months = [];
    try {
        const snapdata = yield store.collection(REF_ANALYTICS).get();
        snapdata.docs.forEach(element => {
            const data = element.data();
            for (const key in data) {
                const val = data[key];
                val[FIELD_DUPLICATE] = 0;
                data[key] = val;
            }
            batch.update(element.ref, data);
            months.push(store.collection(`${REF_ANALYTICS}/${element.id}/${REF_MONTHS}/`));
        });
        for (const colref of months) {
            const coldata = yield colref.get();
            coldata.docs.forEach(celement => {
                const cdata = celement.data();
                for (const key in cdata) {
                    const val = cdata[key];
                    val[FIELD_DUPLICATE] = 0;
                    cdata[key] = val;
                }
                batch.update(celement.ref, cdata);
            });
        }
        const resp = yield batch.commit();
        response.status(200).send(resp);
    }
    catch (e) {
        console.log("Error occurred with sig: ", e);
        response.status(504).send(e);
    }
}));
/**
 * FUnctions tests
 */
/*
export const callTestFroDate = functions.https.onRequest(async (request,response) => {
    const date = returnMonthYear();
    const batch = admin.firestore().batch();

    const r = getWeekNumber(new Date());
    console.log(date+' The week stuff are',r);
    try{
        const data = {
            AMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            },
            TMA:{
                unsolved:0,
                pending: 0,
                solved: 0,
                flag: 0
            }
        }
        const years = ["2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10"];
        const docs = await admin.firestore().collection(REF_ANALYTICS).get();
        docs.forEach( doc =>{
            const id = doc.id;
            years.forEach( key => {
                let ref = admin.firestore().collection(REF_ANALYTICS).doc(id).collection("Months").doc(key);
                batch.set(ref,data,{merge:true});
            });
        });

        const write = await batch.commit();
        response.status(200).send(write);

    }catch(e){
        console.log(e);
        response.status(504).send(e);
        
    }
   
    
    
})*/
//# sourceMappingURL=index.js.map