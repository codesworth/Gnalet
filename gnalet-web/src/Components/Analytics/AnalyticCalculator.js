import {
  AN_TOTALS,
  AN_YEAR_DATA,
  FIELD_SOLVED,
  FIELD_FLAGGED,
  FIELD_DUPLICATE,
  category_ids,
  AN_CATEGORICAL
} from "../../Helpers/Constants";
/**
 * Calculates Analytics for various  Adminstrative Jurisdictions irrespective of categories
 * @param {*} bigdata Query Snapshot from Database
 * @returns JS Nested Object with Administrative Assemlies as outer Keys and statuses as nested Keys
 */
function makeAnalyticForRegionData(regionalData) {
  const data = {
    pending: 0,
    unsolved: 0,
    solved: 0,
    flag: 0,
    duplicate: 0
  };
  //console.log("Initial data: ", data);
  let alltotal = 0;
  for (const id in data) {
    let total = 0;
    for (const category in regionalData) {
      if (category !== "key") {
        const value = regionalData[category];
        if (typeof value == "object") {
          total = total + value[id];
        }
      }
    }
    data[id] = total;
  }
  data.key = regionalData.key;
  const { pending, unsolved, solved, flag, duplicate } = data;
  alltotal = pending + unsolved + solved + flag + duplicate;
  let comp = (solved / (alltotal - flag)) * 100;
  if (solved === 0 || alltotal - (flag + duplicate) === 0) {
    comp = 0;
  }
  data.completion = comp.toFixed(2);
  data.total = alltotal;
  return data;
}

export function makeBigdataAnalytics(bigdata) {
  const retdata = {};
  const data = [];
  const totals = {
    pending: 0,
    unsolved: 0,
    solved: 0,
    flag: 0,
    total: 0,
    duplicate: 0
  };
  bigdata.forEach(element => {
    const catdata = makeAnalyticForRegionData(element);
    for (const key in totals) {
      let val = totals[key];
      val = val + catdata[key];
      totals[key] = val;
    }
    data.push(catdata);
  });
  let comp =
    (totals[FIELD_SOLVED] /
      (totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE]))) *
    100;
  if (
    totals[FIELD_SOLVED] === 0 ||
    totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE]) === 0
  ) {
    comp = 0;
  }

  totals.completion = comp.toFixed(1);
  retdata[AN_YEAR_DATA] = data;
  retdata[AN_TOTALS] = totals;

  return retdata;
}

/**
 * Calculates Analytics for various Issue Categories across all Adminstrative Jurisdictions
 * @param {*} bigdata Query Snapshot from Database
 * @returns JS Nested Object with categories as outer Keys and statuses as nested Keys
 */

export function makeBigdataAnalyticsForCategories(bigdata) {
  const retdata = {};
  const data = [];
  const categories = category_ids;
  const totals = {
    pending: 0,
    unsolved: 0,
    solved: 0,
    flag: 0,
    total: 0,
    duplicate: 0
  };
  categories.forEach(id => {
    retdata[id] = {
      pending: 0,
      unsolved: 0,
      solved: 0,
      flag: 0,
      total: 0,
      duplicate: 0
    };
  });
  bigdata.forEach(element => {
    for (const id in element) {
      console.log(`Element id is: ${id}`);
      let data = element[id];
      for (const stat in data) {
        if (id === "key") break;
        console.log("Retid", retdata[id]);
        console.log("Stat is", stat);
        const old = retdata[id][stat];
        retdata[id][stat] = old + data[stat];
        totals[stat] = totals[stat] + data[stat];
      }
    }
  });

  console.log("The catdata: ", retdata);
  //console.log("The eleemt is: ", element);
  //   const catdata = makeAnalyticForRegionData(element);
  //   for (const key in totals) {
  //     let val = totals[key];
  //     val = val + catdata[key];
  //     totals[key] = val;
  //   }
  //   data.push(catdata);
  // });
  let comp =
    (totals[FIELD_SOLVED] /
      (totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE]))) *
    100;
  if (
    totals[FIELD_SOLVED] === 0 ||
    totals.total - (totals[FIELD_FLAGGED] + totals[FIELD_DUPLICATE]) === 0
  ) {
    comp = 0;
  }
  const returndata = {};
  for (const key in retdata) {
    const value = retdata[key];
    value.key = key;
    data.push(value);
  }
  totals.completion = comp.toFixed(1);
  returndata[AN_CATEGORICAL] = data;
  returndata[AN_TOTALS] = totals;

  return returndata;
}

function collapseAllTotals(data) {
  const totals = { pending: 0, unsolved: 0, solved: 0, flag: 0 };
}
