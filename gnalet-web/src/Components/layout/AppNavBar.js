
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, firestoreConnect , withFirestore} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import {setCategories, setRegions, setUid, setAccess} from '../../actions/settingsAction';
import * as Constants from '../../Helpers/Constants';

class AppNavBar extends Component {

    state = {
        isAuthenticated: false,
        call:false,
        username: '',
        
    }

    componentDidMount(){
        console.log("componentDidMount");

    }

    componentDidUpdate(){
        console.log("componentDidUpdate");
        if(this.state.username === ''){
            this.loadusername(this.props.auth.uid);
        }
        
    }

    

    loadusername(uid) {
        const {firestore} = this.props;
        firestore.get(`${Constants.REF_AUTHORITIES}/${uid}`).then(data =>{
            console.log(data.data());
            const regions = data.data().region;
            const categories = data.data().categories;
            console.log(regions, categories);
            const access = data.data().access;
            setCategories(categories);
            setRegions(regions);
            setUid(uid);
            setAccess(access);
            this.setState({username:data.data().username});
        });
    }

    static  getDerivedStateFromProps(props, state){
        const {auth} = props
        
        if(auth.uid){
            
            return { isAuthenticated: true,call:true}

        }else{
            return {isAuthenticated: false}
        }
    }

    onLogoutClick = (e) => {
        e.preventDefault();

        const {firebase} = this.props
        setCategories([]);
        setRegions([]);
        setUid(null);
        setAccess(0);
        firebase.logout()
        //console.log("Logout Serrtihgd: ",this.props.settings);
    }

  render() {
      const { isAuthenticated, username} = this.state;
      const {auth } = this.props;
      
      //const { allowRegistration} = this.props.settings;
    return (
        
        <nav className='navbar navbar-expand-md navbar-dark bg-primary mb-4'>
            <div className='container'>
                <Link to='/' className='navbar-brand'>
                    <h3>GNALET</h3>
                </Link>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarMain'>
                    <span navbar-toggler-icon='true'></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarMain'>
                    <ul className='navbar-nav mr-auto'>
                    {isAuthenticated ? (
                        <li>
                        <Link to='/' className='nav-link'>Dashboard</Link>
                    </li>
                    ) : null}
                    </ul>
                    {isAuthenticated ?  (
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item"><a href="#!" className="nav-link">{username}</a></li>
                            <li>
                                <Link to='/settings' className='nav-link'>Settings</Link>
                            </li> 
                            <li className="nav-item"><a href="/#" className="nav-link" onClick={this.onLogoutClick}>Logout</a> </li>
                        </ul>
                    ) : null}
                </div>
            </div>
        </nav>
    )
  }
}


AppNavBar.propTypes = {
    firebase: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
};

export default compose(
    firebaseConnect(),withFirestore,
    connect((state, props) => ({
        auth: state.firebase.auth,
        settings: state.settings
    }),{setCategories,setRegions, setUid, setAccess})
)(AppNavBar);