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

  render() {
    //const {periodVal} = this.props
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
              className="custom-select"
              id="inputGroupSelect04"
              aria-label="Example select with button addon"
              onChange={this.onChange.bind(this)}
              name="period"
            >
              <option value="0">Today</option>
              <option value="1">Yesterday</option>
              <option value="2">Week</option>
              <option value="3">Month</option>
              <option value="4">2019</option>
              <option value="5">All Time</option>
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
}
