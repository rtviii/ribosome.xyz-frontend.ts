export const LOAD_LOCAL_DATA = "LOAD_LOCAL_DATA"


export interface loadLocalData {
    type: typeof LOAD_LOCAL_DATA,
    payload: Array<any>
}



export type LocalDataActionTypes = loadLocalData ;
