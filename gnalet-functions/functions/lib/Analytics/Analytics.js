"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as admin from "firebase-admin";
const moment = require("moment");
const Constants_1 = require("../Constants");
const DataTrack_1 = require("./DataTrack");
const index_1 = require("../index");
//const store = admin.firestore();
/**
 * New Analytics . More Efficient
 */
const changedCategory = (all_analytics, td_analytics, prevCat, newCat, prevStatus, newStatus) => {
    const prevData = [];
    const newData = [];
    const an_data_allPrev = all_analytics.get(prevCat);
    const prevAnaData = new DataTrack_1.AnalyticData(an_data_allPrev);
    prevAnaData.categoryChange(prevStatus);
    prevData.push(prevAnaData.data());
    const an_data_allNew = all_analytics.get(newCat);
    if (an_data_allNew) {
        const newAnaData = new DataTrack_1.AnalyticData(an_data_allNew);
        newAnaData.updatedStatus(newStatus);
        newData.push(newAnaData.data());
    }
    else {
        const newAnaData = new DataTrack_1.AnalyticData();
        newAnaData.updatedStatus(newStatus);
        newData.push(newAnaData.data());
    }
    const an_data_tdPrev = td_analytics.get(prevCat);
    const prevtdAna = new DataTrack_1.AnalyticData(an_data_tdPrev);
    prevtdAna.categoryChange(prevStatus);
    prevData.push(prevtdAna.data());
    const an_data_tdNew = td_analytics.get(newCat);
    if (an_data_tdNew) {
        const newTDana = new DataTrack_1.AnalyticData(an_data_tdNew);
        newTDana.updatedStatus(newStatus);
        newData.push(newTDana.data());
    }
    else {
        const newTDana = new DataTrack_1.AnalyticData();
        newTDana.updatedStatus(newStatus);
        newData.push(newTDana.data());
    }
    return { previous: prevData, current: newData };
};
const updateAnalytics = (categoryAnalytics, status, category, initialSnapshot) => {
    if (categoryAnalytics) {
        const analyticData = new DataTrack_1.AnalyticData(categoryAnalytics);
        if (initialSnapshot && initialSnapshot.exists) {
            const initialStatus = initialSnapshot.get(Constants_1.FIELD_STATUS);
            analyticData.updatedStatus(status, initialStatus);
        }
        else {
            analyticData.updatedStatus(status);
        }
        return { [category]: analyticData.data() };
    }
    else {
        const new_analytics = new DataTrack_1.AnalyticData();
        new_analytics.updatedStatus(status);
        return { [category]: new_analytics.data() };
    }
};
exports.analyse = async (snapshot, initialSnapshot) => {
    const batch = index_1.store.batch();
    const status = snapshot.get(Constants_1.FIELD_STATUS);
    const category = snapshot.get(Constants_1.FIELD_CATEGORY);
    const region = snapshot.get(Constants_1.FIELD_SUP_CODE);
    const year = initialSnapshot
        ? initialSnapshot.get(Constants_1.FIELD_YEAR)
        : moment().format("YYYY");
    const day_of_year = initialSnapshot
        ? initialSnapshot.get(Constants_1.FIELD_DAY_OF_YEAR)
        : moment().dayOfYear();
    const allAnalyticRef = index_1.store.doc(`${Constants_1.REF_ANALYTICS}/${region}`);
    const allexistingAnalyticSnap = await allAnalyticRef.get();
    const thisYearRef = index_1.store.doc(`${Constants_1.REF_ANALYTICS}/${region}/${Constants_1.REF_ANALYTICS_YEAR}/${year}`);
    const thisYearSnap = await thisYearRef.get();
    const todayAnalyticRef = index_1.store.doc(`${Constants_1.REF_ANALYTICS}/${region}/${Constants_1.REF_ANALYTICS_YEAR}/${year}/${Constants_1.REF_ANALYTICS_DAY_OF_YEAR}/${day_of_year}`);
    const todayAnalytics = await todayAnalyticRef.get();
    if (initialSnapshot) {
        const initialCat = initialSnapshot.get(Constants_1.FIELD_CATEGORY);
        const finalCat = snapshot.get(Constants_1.FIELD_CATEGORY);
        if (initialCat !== finalCat) {
            const prevStatus = initialSnapshot.get(Constants_1.FIELD_STATUS);
            const newStatus = snapshot.get(Constants_1.FIELD_STATUS);
            const data = changedCategory(allexistingAnalyticSnap, todayAnalytics, initialCat, finalCat, prevStatus, newStatus);
            batch.set(allAnalyticRef, { [initialCat]: data.previous[0], [finalCat]: data.current[0] }, { merge: true });
            batch.set(todayAnalyticRef, { [initialCat]: data.previous[1], [finalCat]: data.current[1] }, { merge: true });
            return batch.commit();
        }
    }
    const all_analytics_for_category = allexistingAnalyticSnap.get(category);
    const td_ana_cat = todayAnalytics.get(category);
    const thisYearAnacat = thisYearSnap.get(category);
    const alldata = updateAnalytics(all_analytics_for_category, status, category, initialSnapshot);
    batch.set(allAnalyticRef, alldata, { merge: true });
    const yeardata = updateAnalytics(thisYearAnacat, status, category, initialSnapshot);
    batch.set(thisYearRef, yeardata, { merge: true });
    const td_data = updateAnalytics(td_ana_cat, status, category, initialSnapshot);
    batch.set(todayAnalyticRef, td_data, { merge: true });
    return batch.commit();
};
/*
export async function statusDidUpdated(
  supCode: string,
  befcat: string,
  afcat: string,
  oldstatus: number,
  newstatus: number
) {
  return admin.firestore().runTransaction(async transaction => {
    //const actualAdmin = Assemblies[supCode];
    // console.log("The supcode is: " + supCode);
    // console.log("The supcode is: " + actualAdmin);
    const aref = admin.firestore().doc(`${REF_ANALYTICS}/${supCode}`);
    //const mref = admin.firestore().doc(`${REF_ANALYTICS}/${category}/${REF_MONTHS}/${month}`);
    const analyticdata = await transaction.get(aref);
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
      body[afcat][getStatusString(newstatus)] = 1;
      transaction.set(aref, body, { merge: true });
    } else {
      const father = analyticdata.data();
      if (befcat === afcat) {
        if (analyticdata.get(befcat)) {
          const data = analyticdata.get(afcat);
          const oldnumb = data[getStatusString(newstatus)];
          data[getStatusString(newstatus)] = oldnumb + 1;
          if (oldstatus !== newstatus) {
            data[getStatusString(oldstatus)] =
              data[getStatusString(oldstatus)] - 1;
          }
          father[afcat] = data;
          transaction.set(aref, father, { merge: true });
        } else {
          father[afcat] = {
            unsolved: 0,
            pending: 0,
            solved: 0,
            flag: 0,
            duplicate: 0
          };
          father[afcat][getStatusString(newstatus)] = 1;
          transaction.set(aref, father, { merge: true });
        }
      } else {
        const befdata = analyticdata.get(befcat);
        const afdata = analyticdata.get(afcat) ? analyticdata.get(afcat) : null;
        const oldnumb = befdata[getStatusString(oldstatus)];
        befdata[getStatusString(newstatus)] = oldnumb - 1;
        father[befcat] = befdata;
        if (afdata !== null) {
          afdata[getStatusString(oldstatus)] =
            afdata[getStatusString(oldstatus)] + 1;
          father[afcat] = afdata;
          transaction.set(aref, father, { merge: true });
        } else {
          father[afcat] = {
            unsolved: 0,
            pending: 0,
            solved: 0,
            flag: 0,
            duplicate: 0
          };
          father[afcat][getStatusString(newstatus)] = 1;
          transaction.set(aref, father, { merge: true });
        }
      }
    }
  });
}

export async function performAnalyticsOnAdd(
  category: string,
  month: string,
  sup: string
) {
  return admin.firestore().runTransaction(async transaction => {
    const aref = admin.firestore().doc(`${REF_ANALYTICS}/${category}`);
    const mref = admin
      .firestore()
      .doc(`${REF_ANALYTICS}/${category}/${REF_MONTHS}/${month}`);
    const analyticdata = await transaction.get(aref);
    const analyticmonth = await transaction.get(mref);
    if (!analyticdata.exists) {
      throw { message: "Document data does not exist" };
    }
    const supdata = analyticdata.get(sup);
    const msupdata = analyticmonth.get(sup);
    const unsolved: number = supdata[FIELD_UNSOLVED];
    const munsolved: number = msupdata[FIELD_UNSOLVED] + 1;
    const newvalve = unsolved + 1;
    supdata[FIELD_UNSOLVED] = newvalve;
    msupdata[FIELD_UNSOLVED] = munsolved;
    transaction.update(aref, { [sup]: supdata });
    transaction.set(mref, { [sup]: msupdata }, { merge: true });
  });
}

export async function updatedCategory(
  oldcat: string,
  month: string,
  afcat: string,
  oldstatus: number,
  sup
) {
  await admin.firestore().runTransaction(async transaction => {
    const aref = admin.firestore().doc(`${REF_ANALYTICS}/${oldcat}`);
    const mref = admin
      .firestore()
      .doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
    const newaref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
    const newmref = admin
      .firestore()
      .doc(`${REF_ANALYTICS}/${afcat}/${REF_MONTHS}/${month}`);
    const analyticdata = await transaction.get(aref);
    const analyticmonth = await transaction.get(mref);
    const newanalyticdata = await transaction.get(newaref);
    const newanalyticmonth = await transaction.get(newmref);
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
  });
}

export async function statusWasUpdated(
  oldcat: string,
  month: string,
  sup: string,
  afcat: string,
  oldstatus: number,
  newstatus: number
) {
  await admin.firestore().runTransaction(async transaction => {
    const aref = admin.firestore().doc(`${REF_ANALYTICS}/${afcat}`);
    const mref = admin
      .firestore()
      .doc(`${REF_ANALYTICS}/${oldcat}/${REF_MONTHS}/${month}`);
    const analyticdata = await transaction.get(aref);
    const analyticmonth = await transaction.get(mref);
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
  });
}

export async function documentDeleted(
  status: number,
  category: string,
  supcode: string
) {
  if (status === 3) {
    const store = admin.firestore();
    const analytic = await store
      .doc(`${REF_ANALYTICS}/${Regions[supcode]}`)
      .get();
    const data = analytic.get(category);
    const bdata = analytic.data();
    const newflagnum = data[getStatusString(status)] - 1;
    data[getStatusString(status)] = newflagnum;
    bdata[category] = data;
    const wr = await store.doc(`${REF_ANALYTICS}/${category}`).update(data);
    return Promise.resolve(wr);
  } else {
    return Promise.resolve();
  }
}


/*

export async function performAnalyticsOnAllDocs(response) {
  const batch = admin.firestore().batch();
  const store = admin.firestore();
  const allcats = {
    VEHICULAR: {},
    SANITATION: {},
    CRIMES: {},
    INDISCIPLINE: {},
    WATER: {},
    POTHOLES: {},
    ECG: {},
    HFDA: {},
    GSA: {},
    OTHERS: {}
  };
  const allmonths = {};
  try {
    const alldocs = await admin
      .firestore()
      .collection(REF_REPORTS)
      .get();
    alldocs.forEach(element => {
      const status = element.get(FIELD_STATUS);
      const category = element.get(FIELD_CATEGORY);
      const region = element.get(FIELD_SUP_BODY);
      let numb = 0;
      if (region in allcats[category]) {
        if (getStatusString(status) in allcats[category][region]) {
          numb = allcats[category][region][getStatusString(status)];
        }
      } else {
        allcats[category][region] = {};
      }

      allcats[category][region][getStatusString(status)] = numb + 1;
      const mid = returnMonthYear(element.get("ts"));
      let monthnumb = 0;
      if (mid in allcats[category]) {
        if (region in allcats[category][mid]) {
          if (getStatusString(status) in allcats[category][mid][region]) {
            monthnumb = allcats[category][mid][region][getStatusString(status)];
          } else {
            allcats[category][mid][region] = {};
          }
        }
      } else {
        allcats[category][mid] = {
          [region]: {}
        };
      }

      allcats[category][mid][region][getStatusString(status)] = monthnumb + 1;
    });

    for (const key in allcats) {
      const value = allcats[key];
      const gendata = {};
      const monthdata = {};
      for (const ikey in value) {
        if (ikey.length === 3) {
          gendata[ikey] = value[ikey];
        } else {
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

    const final = await batch.commit();
    response.status(200).send(`Finished performing analytics:
        Write Time: ${final}`);
  } catch (e) {
    console.log("Error occurred with sig: ", e);
    //console.log("Object value ", allcats);
    response.status(504).send(`Error occurred with sig: ${e}`);
  }
}

/*

export async function resetAnalyticsToZero(response) {
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
    const docs = await admin
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

    const write = await batch.commit();
    response.status(200).send(write);
  } catch (e) {
    console.log(e);
    response.status(504).send(e);
  }
}
*/
//# sourceMappingURL=Analytics.js.map