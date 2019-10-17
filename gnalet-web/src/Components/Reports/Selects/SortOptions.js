import React from "react";
import {
  facingCategoryname,
  publicFacingRegion,
  category_ids,
  regionArray
} from "../../../Helpers/Constants";
export default class SortOptions extends React.Component {
  constructor() {
    super();
  }

  onChange = e => {
    const { updateSorts } = this.props;
    //this.setState({ [e.target.name]: e.target.value })
    updateSorts(e.target.name, e.target.value);
  };

  update = () => {
    this.props.updateQueries();
  };

  valueForPeriod = val => {
    console.log("The default is: " + val);
    const rval = parseInt(val, 10);
    switch (rval) {
      case 0:
        return "Today";
      case 1:
        return "Yesterday";
      case 2:
        return "Week";
      case 3:
        return "Month";
      case 4:
        return "2019";
      case 5:
        return "All Time";
      default:
        return "Duration";
    }
  };

  render() {
    const { periodval } = this.props;
    return (
      <div className="row mg">
        <div className="col-md-4">
          {category_ids.length > 0 ? (
            <div className="input-group  bg-white rounded">
              <select
                className="custom-select"
                id="inputGroupSelect04"
                aria-label=""
                name="category"
                onChange={this.onChange.bind(this)}
              >
                {category_ids.map(cat => {
                  return (
                    <option key={cat} value={cat}>
                      {facingCategoryname(cat)}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}
        </div>
        <div className="col-md-4">
          {regionArray.length > 0 ? (
            <div className="input-group  bg-white rounded">
              <select
                className="custom-select"
                id="inputGroupSelect04"
                aria-label=""
                name="region"
                onChange={this.onChange.bind(this)}
              >
                {regionArray.map(reg => {
                  return (
                    <option key={reg} value={reg}>
                      {publicFacingRegion(reg)}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}
        </div>
        <div className="col-md-4">
          <div className="input-group   bg-white rounded">
            <select
              value={periodval}
              className="custom-select"
              id="inputGroupSelect04"
              aria-label="Example select with button addon"
              onChange={this.onChange.bind(this)}
              name="period"
            >
              {" "}
              {["0", "1", "2", "3", "4", "5"].map(x => {
                if (periodval.toString() === x) {
                  return (
                    <option key={x} value={x}>
                      {this.valueForPeriod(periodval)}
                    </option>
                  );
                } else {
                  return (
                    <option key={x} value={x}>
                      {this.valueForPeriod(x)}
                    </option>
                  );
                }
              })}
            </select>
            <div className="input-group-append">
              <button
                className="btn btn-outline-info"
                type="button"
                onClick={this.update.bind(this)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // options = () => {
  //   const def = this.props.periodval.toString()
  //   const options = [def] //["0","1","2","3","4","5"]
  //   for (let i = 0; i < 6; i++) {
  //     if (i.toString() != def){
  //       options.push
  //     }

  //   }

  // }
}
