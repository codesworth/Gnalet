import { AnalyticData } from "../../Components/Analytics/AnalyticData";
import { Duration } from "../../Helpers/Assemblies";
import * as moment from "moment";

export const parsetoday = snapshot => {
  const data = snapshot.data();
  const entries = Object.entries(data);
  for (const [key, vals] of entries) {
  }
};

export class AnalyticParser {
  snapshot = null;
  allTime = false;

  constructor(snapshot, allTime) {
    this.snapshot = snapshot;
    this.allTime = allTime;
  }

  analyticForCategory = category => {
    if (this.snapshot) {
      if (this.allTime) {
        const data = this.snapshot.get(category);
        return new AnalyticData(data);
      }
    }
    return null;
  };

  analyticsForPeriod = period => {
    if (this.allTime) {
      return null;
    }
    switch (period) {
      case Duration.today:
        const day = moment().dayOfYear();
        const data = this.snapshot.get(day.toString());
        const analytics = this.combineAnalytics(data);
        return analytics;
      case Duration.thisYear:
        const analysis = new AnalyticData(null);
        for (const [key, vals] of Object.entries(this.snapshot.data())) {
          analysis.add(this.combineAnalytics(vals));
        }
      default:
        return null;
    }
  };

  combineAnalytics = data => {
    const entries = Object.entries(data);
    let analytics = new AnalyticData(null);
    for (const [key, val] of entries) {
      analytics.add(val);
    }
  };
}
