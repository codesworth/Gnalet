import React, { Component } from 'react'
import { REF_FEEDBACK } from '../../Helpers/Constants';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
class Feedback extends Component {


  render() {
      const {feeds} = this.props;
      console.log("These are feeds: ",feeds);
    return (
      <div>
        
      </div>
    )
  }
}


export default compose(
    firestoreConnect([REF_FEEDBACK]), // or { collection: 'todos' }
    connect((state, props) => ({
      feeds: state.firestore.ordered[REF_FEEDBACK]
    }))
   )(Feedback)
  