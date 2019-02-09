import React, { Component } from "react";
import { REF_FEEDBACK } from "../../Helpers/Constants";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import FeedbackCell from "./FeedbackCell";
import Spinner from "../layout/Spinner";
class Feedback extends Component {
  render() {
    const { feeds } = this.props;
    //console.log("These are feeds: ", feeds);
    //const users = ["Jerry lai", "Michelle Bonna", "Fam Claude", "Sam Presti"];
    if (feeds) {
      const { firestore } = this.props;
      return (
        <div className="col-md-8">
          <div className="card">
            <h5 className="card-header">FEEDBACKS</h5>
            <div className="card-body">
              <ul className="list-group">
                {feeds.map(feed => {
                  return (
                    <li key={feed.id} className="list-group-item">
                      <FeedbackCell feed={feed} store={firestore} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default compose(
  firestoreConnect([REF_FEEDBACK]),
  withFirestore, // or { collection: 'todos' }
  connect((state, props) => ({
    feeds: state.firestore.ordered[REF_FEEDBACK]
  }))
)(Feedback);
