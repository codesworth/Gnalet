import React, { Component } from "react";
import { REF_FEEDBACK } from "../../Helpers/Constants";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import FeedbackCell from "./FeedbackCell";
class Feedback extends Component {
  render() {
    const { feeds } = this.props;
    console.log("These are feeds: ", feeds);
    const users = ["Jerry lai", "Michelle Bonna", "Fam Claude", "Sam Presti"];
    return (
      <div className="col-md-7">
        <div className="card">
          <h5 class="card-header">FEEDBACKS</h5>
          <div className="card-body">
            <ul className="list-group">
              {users.map(user => {
                return (
                  <li key="user" className="list-group-item">
                    <FeedbackCell username={user} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  firestoreConnect([REF_FEEDBACK]), // or { collection: 'todos' }
  connect((state, props) => ({
    feeds: state.firestore.ordered[REF_FEEDBACK]
  }))
)(Feedback);
