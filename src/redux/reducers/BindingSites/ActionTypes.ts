import { flattenDeep } from "lodash";
import { Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { BindingSite, LigandClass } from "../../DataInterfaces";
import { Ligand } from "../../RibosomeTypes";

export type BSitesFilter = "SPECIES" | "SEARCH" | "YEAR"  | "EXPERIMENTAL_METHOD" | "RESOLUTION"

export const REQUEST_ALL_BSITES_GO      = "REQUEST_ALL_BSITES_GO"     ;
export const REQUEST_ALL_BSITES_ERR     = "REQUEST_ALL_BSITES_ERR"     ;
export const REQUEST_ALL_BSITES_SUCCESS = "REQUEST_ALL_BSITES_SUCCESS"     ;

export interface requestAllBsitesGo      { type: typeof REQUEST_ALL_BSITES_GO                            }
export interface requestAllBsitesErr     { type: typeof REQUEST_ALL_BSITES_ERR    ; error: Error         }
export interface requestAllBsitesSuccess { type: typeof REQUEST_ALL_BSITES_SUCCESS; bsites: BindingSite[], ligand_classes: LigandClass[]}
          


export type BSitesActions = requestAllBsitesGo | requestAllBsitesErr | requestAllBsitesSuccess

export type AllLigandsResponseType = {
	ligand: Ligand,
 	presentIn: {
		  _organismId   : number[],
		  citation_title: string,
		  expMethod     : string,
		  rcsb_id       : string,
		  resolution    : number,
		}[]
}
export const request_all_bsites = () => {

  return async (dispatch: Dispatch<BSitesActions>) => {
    dispatch({
      type: "REQUEST_ALL_BSITES_GO"
    });

    getNeo4jData("neo4j", {endpoint: "get_all_ligands", params: null})
      .then(
        response => {

	     var ligand_classes = response.data

	     var disaggregated = response.data.map(( bs:AllLigandsResponseType ) =>{return bs.presentIn.map(struct=> Object.assign({},{...bs.ligand},struct))	 })
	         disaggregated = flattenDeep(disaggregated)
          dispatch({
            type  : REQUEST_ALL_BSITES_SUCCESS,
            bsites: disaggregated,
			ligand_classes
          });
        },
        error => {
			console.log("errored out");
			console.log(error);
			
          dispatch({
            type: REQUEST_ALL_BSITES_ERR,
            error: error,
          });
        }
      )
  };
};

