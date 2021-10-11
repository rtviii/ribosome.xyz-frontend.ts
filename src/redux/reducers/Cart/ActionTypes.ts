import {  RNAProfile } from "../../DataInterfaces";
import { Protein, RibosomeStructure } from "../../RibosomeTypes";

export const TOGGLE_CART             = "TOGGLE_CART";
export const CART_REMOVE_ITEM        = "CART_REMOVE_ITEM";
export const CART_ADD_ITEM           = "CART_ADD_ITEM";
export const CART_CLEAR_ITEMS        = "CART_CLEAR_ITEMS";
export const CART_TOGGLE_ITEM_SELECT = "CART_TOGGLE_ITEM_SELECT";

export type CartItem = Protein | RibosomeStructure | RNAProfile

export interface toggleCart     {type: typeof TOGGLE_CART}

export interface toggleItemSelect     {
  type    : typeof CART_TOGGLE_ITEM_SELECT,
  item    : CartItem,
  selected: boolean}

interface cartRemoveItem        {type: typeof CART_REMOVE_ITEM, item:CartItem}
interface cartAddItem           {type: typeof CART_ADD_ITEM, item:CartItem}
interface cartClearItems        {type: typeof CART_CLEAR_ITEMS}



export type CartActions = toggleCart | cartRemoveItem | cartAddItem | cartClearItems | toggleItemSelect
export const toggle_cart_item_select       =  (item:CartItem, selected:boolean): toggleItemSelect =>
 ({type: "CART_TOGGLE_ITEM_SELECT",
item,selected });
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




