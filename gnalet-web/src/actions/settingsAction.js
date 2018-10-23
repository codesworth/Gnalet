import { PV_CATEGORIES, PV_REGION, UID, ACCESS, USERNAME, RELOAD} from '../actions/types';
import { USER_SETTINGS} from '../Helpers/Constants';

export const setCategories = (payload) => {

    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));
    settings.categories = payload

    //setbacx to localstorage

    localStorage.setItem(USER_SETTINGS,JSON.stringify(settings));
    return {
        type: PV_CATEGORIES,
        payload: settings.categories
    }
}


export const setRegions = (payload) => {

    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));
    settings.region = payload

    //setbacx to localstorage

    localStorage.setItem(USER_SETTINGS,JSON.stringify(settings));
    return {
        type: PV_REGION,
        payload: settings.region
    }
}

export const setUid = (payload) => {
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));
    settings.uid = payload;

    //setbacx to localstorage

    localStorage.setItem(USER_SETTINGS,JSON.stringify(settings));
    return {
        type: UID,
        payload: settings.uid
    }
}

export const setAccess = (payload) => {
    
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));

    settings.access = payload;

    localStorage.setItem(USER_SETTINGS, JSON.stringify(settings));

    return {
        type: ACCESS,
        payload: settings.access
    }
}

export const setUsername = (payload) => {
    
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));

    settings.username = payload;

    localStorage.setItem(USER_SETTINGS, JSON.stringify(settings));

    return {
        type: USERNAME,
        payload: settings.username
    }
}

export const setReload = (payload) => {
    
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS));

    settings.requiresReload = payload;
    

    localStorage.setItem(USER_SETTINGS, JSON.stringify(settings));

    return {
        type: RELOAD,
        payload: settings.requiresReload
    }
}