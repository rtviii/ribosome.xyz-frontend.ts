import {RibosomalProtein} from './../../RibosomeTypes'
import { ProteinActions } from './ActionTypes'
import {NeoHomolog} from './../../DataInterfaces'





interface ProteinsReducerState{

    error              :  any,
    isLoading          :  boolean;
    erroredOut         :  boolean;
    current_ban_class  :  NeoHomolog[];
    allProteins        :  RibosomalProtein[];

    derived_filtered   :  RibosomalProtein[];
}

const initialStateProteinsReducer:ProteinsReducerState = {
    current_ban_class  :  [],
    allProteins        :  [],
    error              :  null,
    derived_filtered   :  [],
    isLoading          :  false,
    erroredOut         :  false

}
export  const  ProteinsReducer = (
    state: ProteinsReducerState = initialStateProteinsReducer,
    action: ProteinActions
):ProteinsReducerState =>{
    switch(action.type){
        case "REQUEST_BAN_CLASS_GO":
            return {...state, isLoading:true}
        case "REQUEST_BAN_CLASS_SUCCESS":
            return {...state, current_ban_class: action.payload}
        case "REQUEST_BAN_CLASS_ERR":
            return {...state, isLoading:false, error:action.error, erroredOut:true}
        default:
            return state
    }
}
