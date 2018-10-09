import { PV_CATEGORIES, PV_REGION, UID, ACCESS} from '../actions/types';



export default function(state = {}, action){

    switch(action.type){
        case PV_CATEGORIES:
            return{
                ...state,
                categories: action.payload
            }
        case PV_REGION:
            return{
                ...state,
                region: action.payload
            } 
        case UID:
            return{
                ...state,
                uid: action.payload
            }

        case ACCESS:
            return{
                ...state,
                access: action.payload
            }
        default:
            return state;
    }
}