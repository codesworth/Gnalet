import { PV_CATEGORIES, PV_REGION, UID, ACCESS, USERNAME} from '../actions/types';


export const setCategories = (payload) => {

    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.categories = payload

    //setbacx to localstorage

    localStorage.setItem('settings',JSON.stringify(settings));
    return {
        type: PV_CATEGORIES,
        payload: settings.categories
    }
}


export const setRegions = (payload) => {

    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.region = payload

    //setbacx to localstorage

    localStorage.setItem('settings',JSON.stringify(settings));
    return {
        type: PV_REGION,
        payload: settings.region
    }
}

export const setUid = (payload) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.uid = payload;

    //setbacx to localstorage

    localStorage.setItem('settings',JSON.stringify(settings));
    return {
        type: UID,
        payload: settings.uid
    }
}

export const setAccess = (payload) => {
    
    const settings = JSON.parse(localStorage.getItem('settings'));

    settings.access = payload;

    localStorage.setItem('settings', JSON.stringify(settings));

    return {
        type: ACCESS,
        payload: settings.access
    }
}

export const setUsername = (payload) => {
    
    const settings = JSON.parse(localStorage.getItem('settings'));

    settings.username = payload;

    localStorage.setItem('settings', JSON.stringify(settings));

    return {
        type: USERNAME,
        payload: settings.username
    }
}