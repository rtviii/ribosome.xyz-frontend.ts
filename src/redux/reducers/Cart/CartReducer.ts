import _ from 'lodash';
import { RNAProfile } from '../../DataInterfaces';
import { RibosomalProtein, RibosomeStructure } from '../../RibosomeTypes';
import {CartActions, CartItem} from './ActionTypes'

export function isProt(i:CartItem): i is RibosomalProtein{
    return (i as RibosomalProtein).nomenclature !==undefined;
}
export function isStruct(i:CartItem): i is RibosomeStructure{
    return (i as RibosomeStructure).rcsb_id !==undefined;
}
export function isRNA(i:CartItem): i is RNAProfile{
    return (i as RNAProfile).strand !==undefined;
}

interface CartReducerState {
    open         : boolean,
    structs      : string[],
    items        : CartItem[],
    selectedItems: CartItem[]
}

const initialCartReducerState:CartReducerState = {
  structs      : [],
  open         : false,
  items        : [],
  selectedItems: []
}

export const CartReducer = (
  state: CartReducerState = initialCartReducerState,
  action: CartActions
): CartReducerState => {
  switch (action.type) {

    case "TOGGLE_CART":
      return { ...state, open: !state.open };

    case "CART_CLEAR_ITEMS":
      return {...state, items:[]}

    case "CART_ADD_ITEM":
      if  ( state.items.includes(action.item) ){
        alert(" This is already in the workspace.")
        return state
      }
      if (isStruct(action.item)){

        console.log("Added item", action.item);
        
      return {...state, items: [...state.items, action.item], structs:[...state.structs, action.item.rcsb_id]}
      }
      return {...state, items: [...state.items, action.item]}

    case "CART_REMOVE_ITEM":
      if (isStruct(action.item)){
        console.log("removed item", action.item);
       var newstructs = state.structs.filter(r=>r !==(action.item as RibosomeStructure).rcsb_id)
      return {...state, items: state.items.filter(i => {return !_.isEqual(i, action.item)}),structs:newstructs}
      }
      return {...state, items: state.items.filter(i => {return !_.isEqual(i, action.item)})
    }

    case "CART_TOGGLE_ITEM_SELECT":

    if (action.selected){
      var newSelected = [...state.selectedItems, action.item]
      
    }else{
      var newSelected = [...state.selectedItems.filter(i=> i!=action.item)]
    }
    return {...state, selectedItems:newSelected}



    default:
      return state;

  }

};

