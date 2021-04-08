import { Dispatch } from "redux";
import { LigandResponseShape, NeoHomolog, NeoStruct, RNAProfile } from "../../DataInterfaces";
import { RibosomalProtein } from "../../RibosomeTypes";

export const TOGGLE_CART       =  "TOGGLE_CART";
export const CART_REMOVE_ITEM  =  "CART_REMOVE_ITEM";
export const CART_ADD_ITEM     =  "CART_ADD_ITEM";
export const CART_CLEAR_ITEMS  =  "CART_CLEAR_ITEMS";

export type CartItem = RibosomalProtein

export interface toggleCart     {type: typeof TOGGLE_CART}
interface cartRemoveItem        {type: typeof CART_REMOVE_ITEM, item:CartItem}
interface cartAddItem           {type: typeof CART_ADD_ITEM, item:CartItem}
interface cartClearItems        {type: typeof CART_CLEAR_ITEMS}



export type CartActions = toggleCart | cartRemoveItem | cartAddItem | cartClearItems
export const toggle_cart       =  (): toggleCart => ({type: TOGGLE_CART});
export const cart_clear_items  =  (): cartClearItems => ({type: CART_CLEAR_ITEMS});
export const cart_add_item = (item:CartItem): cartAddItem => ({
  type: CART_ADD_ITEM,
  item
});
export const cart_remove_item = (item:CartItem): cartRemoveItem => ({
  type: CART_REMOVE_ITEM,
  item
});




