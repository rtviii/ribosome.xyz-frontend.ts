export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export interface requestStructsSuccess {
  type: typeof REQUEST_STRUCTS_SUCCESS;
  payload: []
}
export interface requestStructsGo {
  type: typeof REQUEST_STRUCTS_GO;
}
export interface requestStructsErr {
  type: typeof REQUEST_STRUCTS_ERR;
  error: Error;
}
export type StructActionTypes =
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess;