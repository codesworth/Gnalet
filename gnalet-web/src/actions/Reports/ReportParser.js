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

  range = { start: 0, end: 0 };

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
      return this.parseAlltime();
    }
    switch (period) {
      case Duration.today:
        console.log(`TOday is: ${period}`);
        const day = moment().dayOfYear();
        const data = this.snapshot.get(day.toString());
        if (data) {
          const analytics = this.combineAnalytics(data);
          return analytics;
        } else {
          return new AnalyticData(null);
        }

      case Duration.yesterday:
        const yesterday = moment().dayOfYear() - 1;
        console.log(`Yesterday was ${yesterday}`);

        const ydata = this.snapshot.get(yesterday.toString());
        if (ydata) {
          const analytics = this.combineAnalytics(ydata);
          return analytics;
        } else {
          return new AnalyticData(null);
        }

      case Duration.thisWeek:
        let start = day - 6;
        if (start < 1) start = 1;
        this.range.start = start;
        this.range.end = day;
        return this.parseRange();

      case Duration.thisYear:
        const analysis = new AnalyticData(null);
        for (const [key, vals] of Object.entries(this.snapshot.data())) {
          analysis.add(this.combineAnalytics(vals));
        }
      default:
        return null;
    }
  };

  parseAlltime = () => {
    return this.combineAnalytics(this.snapshot.data());
  };

  combineAnalytics = data => {
    const entries = Object.entries(data);
    let analytics = new AnalyticData(null);
    for (const [key, val] of entries) {
      analytics.add(val);
    }
    return analytics;
  };

  parseRange = () => {
    const analytics = new AnalyticData(null);
    for (let i = this.range.start; i < this.range.end + 1; i++) {
      const dayData = this.snapshot.get(i.toString());
      analytics.add(this.combineAnalytics(dayData));
    }

    return analytics;
  };
}
