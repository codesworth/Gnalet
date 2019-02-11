import React, { Component } from "react";

import {
  FIELD_UNSOLVED,
  FIELD_PENDING,
  FIELD_SOLVED,
  FIELD_FLAGGED,
  FIELD_DUPLICATE,
  AN_TOTALS
} from "../../Helpers/Constants";

export default class AnalyticsTable extends Component {
  render() {
    const { bigdata, header, totals, t1 } = this.props;

    return (
      <div className="col-md-12">
        <div className="row mg">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h4>{header.toUpperCase()}</h4>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>{t1.toUpperCase()}</th>
                      <th>UNSOLVED</th>
                      <th>PENDING</th>
                      <th>SOLVED</th>
                      <th>FLAGGED</th>
                      <th>DUPLICATE</th>
                      <th>TOTAL</th>
                      <th>% COMPLETION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bigdata.map(data => (
                      <tr key={data.key}>
                        <td>{this.shortenString(data.key)}</td>
                        <td>{data[FIELD_UNSOLVED]}</td>
                        <td>{data[FIELD_PENDING]}</td>
                        <td>{data[FIELD_SOLVED]}</td>
                        <td>{data[FIELD_FLAGGED]}</td>
                        <td>{data[FIELD_DUPLICATE]}</td>
                        <td>{data.total}</td>
                        <td>{data.completion}%</td>
                      </tr>
                    ))}
                    <tr key="total">
                      <td>
                        <h5>TOTALS</h5>
                      </td>
                      <td>
                        <h5>{totals[FIELD_UNSOLVED]}</h5>
                      </td>
                      <td>
                        <h5>{totals[FIELD_PENDING]}</h5>
                      </td>
                      <td>
                        <h5>{totals[FIELD_SOLVED]}</h5>
                      </td>
                      <td>
                        <h5>{totals[FIELD_FLAGGED]}</h5>
                      </td>
                      <td>
                        <h5>{totals[FIELD_DUPLICATE]}</h5>
                      </td>
                      <td>
                        <h5>{totals.total}</h5>
                      </td>
                      <td>
                        <h5>{totals.completion}%</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  shortenString(str) {
    const arrstr = str.split(" ");
    if (arrstr.length > 2) {
      return arrstr[0].concat(" ").concat(arrstr[1]);
    }
    return str;
  }
}
