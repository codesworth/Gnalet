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
const admin = require("firebase-admin");
const Constants_1 = require("../Constants");
const Assemblies_1 = require("./Assemblies");
function statusDidUpdated(supCode, befcat, afcat, oldstatus, newstatus) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const actualAdmin = Assemblies_1.Assemblies[supCode];
            const aref = admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${actualAdmin}`);
            //const mref = admin.firestore().doc(`${REF_ANALYTICS}/${category}/${REF_MONTHS}/${month}`);
            const analyticdata = yield transaction.get(aref);
            //const analyticmonth = await transaction.get(mref);
            if (!analyticdata.exists) {
                //throw { message: "Document data does not exist" };
                const body = {
                    [afcat]: {
                        unsolved: 0,
                        pending: 0,
                        solved: 0,
                        flag: 0,
                        duplicate: 0
                    }
                };
                body[afcat][Constants_1.getStatusString(newstatus)] = 1;
                transaction.update(aref, body);
            }
            else {
                const father = analyticdata.data();
                if (befcat === afcat) {
                    if (analyticdata.get(befcat)) {
                        const data = analyticdata.get(afcat);
                        const oldnumb = data[Constants_1.getStatusString(newstatus)];
                        data[Constants_1.getStatusString(newstatus)] = oldnumb + 1;
                        if (oldstatus !== newstatus) {
                            data[Constants_1.getStatusString(oldstatus)] =
                                data[Constants_1.getStatusString(oldstatus)] - 1;
                        }
                        father[afcat] = data;
                        transaction.update(aref, father);
                    }
                    else {
                        father[afcat] = {
                            unsolved: 0,
                            pending: 0,
                            solved: 0,
                            flag: 0,
                            duplicate: 0
                        };
                        father[afcat][Constants_1.getStatusString(newstatus)] = 1;
                        transaction.update(aref, father);
                    }
                }
                else {
                    const befdata = analyticdata.get(befcat);
                    const afdata = analyticdata.get(afcat) ? analyticdata.get(afcat) : null;
                    const oldnumb = befdata[Constants_1.getStatusString(oldstatus)];
                    befdata[Constants_1.getStatusString(newstatus)] = oldnumb - 1;
                    father[befcat] = befdata;
                    if (afdata !== null) {
                        afdata[Constants_1.getStatusString(oldstatus)] =
                            afdata[Constants_1.getStatusString(oldstatus)] + 1;
                        father[afcat] = afdata;
                        transaction.update(aref, father);
                    }
                    else {
                        father[afcat] = {
                            unsolved: 0,
                            pending: 0,
                            solved: 0,
                            flag: 0,
                            duplicate: 0
                        };
                        father[afcat][Constants_1.getStatusString(newstatus)] = 1;
                        transaction.update(aref, father);
                    }
                }
            }
        }));
    });
}
exports.statusDidUpdated = statusDidUpdated;
function performAnalyticsOnAdd(category, month, sup) {
    return __awaiter(this, void 0, void 0, function* () {
        return admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const aref = admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${category}`);
            const mref = admin
                .firestore()
                .doc(`${Constants_1.REF_ANALYTICS}/${category}/${Constants_1.REF_MONTHS}/${month}`);
            const analyticdata = yield transaction.get(aref);
            const analyticmonth = yield transaction.get(mref);
            if (!analyticdata.exists) {
                throw { message: "Document data does not exist" };
            }
            const supdata = analyticdata.get(sup);
            const msupdata = analyticmonth.get(sup);
            const unsolved = supdata[Constants_1.FIELD_UNSOLVED];
            const munsolved = msupdata[Constants_1.FIELD_UNSOLVED] + 1;
            const newvalve = unsolved + 1;
            supdata[Constants_1.FIELD_UNSOLVED] = newvalve;
            msupdata[Constants_1.FIELD_UNSOLVED] = munsolved;
            transaction.update(aref, { [sup]: supdata });
            transaction.set(mref, { [sup]: msupdata }, { merge: true });
        }));
    });
}
exports.performAnalyticsOnAdd = performAnalyticsOnAdd;
function updatedCategory(oldcat, month, afcat, oldstatus, sup) {
    return __awaiter(this, void 0, void 0, function* () {
        yield admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const aref = admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${oldcat}`);
            const mref = admin
                .firestore()
                .doc(`${Constants_1.REF_ANALYTICS}/${oldcat}/${Constants_1.REF_MONTHS}/${month}`);
            const newaref = admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${afcat}`);
            const newmref = admin
                .firestore()
                .doc(`${Constants_1.REF_ANALYTICS}/${afcat}/${Constants_1.REF_MONTHS}/${month}`);
            const analyticdata = yield transaction.get(aref);
            const analyticmonth = yield transaction.get(mref);
            const newanalyticdata = yield transaction.get(newaref);
            const newanalyticmonth = yield transaction.get(newmref);
            const beforenum = analyticdata.get(sup)[Constants_1.getStatusString(oldstatus)] - 1;
            const mbeforenum = analyticmonth.get(sup)[Constants_1.getStatusString(oldstatus)] - 1;
            const afternum = newanalyticdata.get(sup)[Constants_1.getStatusString(oldstatus)] + 1;
            const mafternum = newanalyticmonth.get(sup)[Constants_1.getStatusString(oldstatus)] + 1;
            const upd = analyticdata.get(sup);
            const mupd = analyticmonth.get(sup);
            const newupd = newanalyticdata.get(sup);
            const newmupd = newanalyticmonth.get(sup);
            upd[Constants_1.getStatusString(oldstatus)] = beforenum;
            mupd[Constants_1.getStatusString(oldstatus)] = mbeforenum;
            newupd[Constants_1.getStatusString(oldstatus)] = afternum;
            newmupd[Constants_1.getStatusString(oldstatus)] = mafternum;
            transaction.update(aref, { [sup]: upd });
            transaction.update(mref, { [sup]: mupd });
            transaction.update(newmref, { [sup]: newmupd });
            transaction.update(newaref, { [sup]: newupd });
        }));
    });
}
exports.updatedCategory = updatedCategory;
function statusWasUpdated(oldcat, month, sup, afcat, oldstatus, newstatus) {
    return __awaiter(this, void 0, void 0, function* () {
        yield admin.firestore().runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
            const aref = admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${afcat}`);
            const mref = admin
                .firestore()
                .doc(`${Constants_1.REF_ANALYTICS}/${oldcat}/${Constants_1.REF_MONTHS}/${month}`);
            const analyticdata = yield transaction.get(aref);
            const analyticmonth = yield transaction.get(mref);
            const beforenum = analyticdata.get(sup)[Constants_1.getStatusString(oldstatus)] - 1;
            const afternum = analyticdata.get(sup)[Constants_1.getStatusString(newstatus)] + 1;
            const mbeforenum = analyticmonth.get(sup)[Constants_1.getStatusString(oldstatus)] - 1;
            const mafternum = analyticmonth.get(sup)[Constants_1.getStatusString(newstatus)] + 1;
            const upd = analyticdata.get(sup);
            const mupd = analyticmonth.get(sup);
            upd[Constants_1.getStatusString(oldstatus)] = beforenum;
            upd[Constants_1.getStatusString(newstatus)] = afternum;
            mupd[Constants_1.getStatusString(oldstatus)] = mbeforenum;
            mupd[Constants_1.getStatusString(newstatus)] = mafternum;
            transaction.update(mref, { [sup]: mupd });
            transaction.update(aref, { [sup]: upd });
        }));
    });
}
exports.statusWasUpdated = statusWasUpdated;
function documentDeleted(status, category, sup) {
    return __awaiter(this, void 0, void 0, function* () {
        if (status === 3) {
            const store = admin.firestore();
            const analytic = yield store.doc(`${Constants_1.REF_ANALYTICS}/${category}`).get();
            const supdata = analytic.get(sup);
            const newflagnum = supdata[Constants_1.getStatusString(status)] - 1;
            supdata[Constants_1.getStatusString(status)] = newflagnum;
            const wr = yield store
                .doc(`${Constants_1.REF_ANALYTICS}/${category}`)
                .update({ [sup]: supdata });
            return Promise.resolve(wr);
        }
        else {
            return Promise.resolve();
        }
    });
}
exports.documentDeleted = documentDeleted;
function performAnalyticsOnAllDocs(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = admin.firestore().batch();
        const store = admin.firestore();
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
            const alldocs = yield admin
                .firestore()
                .collection(Constants_1.REF_REPORTS)
                .get();
            alldocs.forEach(element => {
                const status = element.get(Constants_1.CASE_STATUS);
                const category = element.get(Constants_1.FIELD_CATEGORY);
                const region = element.get(Constants_1.CASE_SUP_BODY);
                let numb = 0;
                if (region in allcats[category]) {
                    if (Constants_1.getStatusString(status) in allcats[category][region]) {
                        numb = allcats[category][region][Constants_1.getStatusString(status)];
                    }
                }
                else {
                    allcats[category][region] = {};
                }
                allcats[category][region][Constants_1.getStatusString(status)] = numb + 1;
                const mid = Constants_1.returnMonthYear(element.get("ts"));
                let monthnumb = 0;
                if (mid in allcats[category]) {
                    if (region in allcats[category][mid]) {
                        if (Constants_1.getStatusString(status) in allcats[category][mid][region]) {
                            monthnumb = allcats[category][mid][region][Constants_1.getStatusString(status)];
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
                allcats[category][mid][region][Constants_1.getStatusString(status)] = monthnumb + 1;
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
                batch.set(store.doc(`${Constants_1.REF_ANALYTICS}/${key}`), gendata, {
                    merge: true
                });
                for (const id in monthdata) {
                    const mref = store.doc(`${Constants_1.REF_ANALYTICS}/${key}/${Constants_1.REF_MONTHS}/${id}`);
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
    });
}
exports.performAnalyticsOnAllDocs = performAnalyticsOnAllDocs;
function resetAnalyticsToZero(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = admin.firestore().batch();
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
                Constants_1.VEHICULAR,
                Constants_1.SANITATION,
                Constants_1.CRIMES,
                Constants_1.WATER,
                Constants_1.POTHOLES,
                Constants_1.ECG,
                Constants_1.HFDA,
                Constants_1.GSA,
                Constants_1.OTHERS
            ];
            cats.forEach(cat => {
                batch.set(admin.firestore().doc(`${Constants_1.REF_ANALYTICS}/${cat}`), data, {
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
                .collection(Constants_1.REF_ANALYTICS)
                .get();
            docs.forEach(doc => {
                const id = doc.id;
                years.forEach(key => {
                    let ref = admin
                        .firestore()
                        .collection(Constants_1.REF_ANALYTICS)
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
    });
}
exports.resetAnalyticsToZero = resetAnalyticsToZero;
//# sourceMappingURL=Analytics.js.map