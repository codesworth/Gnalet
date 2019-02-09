import React, { Component } from "react";
import { formatDate, REF_FEEDBACK } from "../../Helpers/Constants";

export default class FeedbackCell extends Component {
  state = {};
  render() {
    const { username, feedback, locality, ts, id } = this.props.feed;
    const { store } = this.props;
    return (
      <div>
        <blockquote className="blockquote mb-0">
          <p>{feedback}</p>
          <footer className="blockquote-footer">
            {username}
            {" from"}
            <cite title="Source Title">
              {" "}
              {locality}
              {" -- "}
              {this.getDateFromTimeStamp(ts)}
            </cite>
          </footer>
        </blockquote>
        <div>
          <a
            href="#"
            className="btn btn-danger"
            onClick={this.retire.bind(this, id, store)}
          >
            Retire Feedback
          </a>
        </div>
      </div>
    );
  }

  retire(id, store) {
    console.log(id);
    store
      .collection(REF_FEEDBACK)
      .doc(id)
      .delete()
      .then(x => {
        console.log(x);
      })
      .catch(err => {
        console.log("Error occurred: " + err);
      });
  }

  getDateFromTimeStamp(ts) {
    const date = Date(ts);
    return formatDate(date);
  }
}
