import { RibosomalProtein } from '../../RibosomeTypes';
import {CartActions} from './ActionTypes'

interface CartReducerState {

    hidden    :  boolean,
    proteins  :  RibosomalProtein[],

}

const initialCartReducerState:CartReducerState = {
    hidden    :  true,
    proteins  :  []
}

export const CartReducer = (
  state: CartReducerState = initialCartReducerState,
  action: CartActions
): CartReducerState => {
  switch (action.type) {

    case "TOGGLE_CART":
      return { ...state, hidden: !state.hidden };

    case "CART_CLEAR_ITEMS":
      return {...state, proteins:[]}

    case "CART_ADD_ITEM":
      return {...state, proteins: [...state.proteins, action.item]}

    case "CART_ADD_ITEM":
      return {...state, proteins: state.proteins.filter(i => i !== action.item)}

    default:
      return state;

  }

};

