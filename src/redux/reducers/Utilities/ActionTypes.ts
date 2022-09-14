
export const REQUEST_STATIC_CATALOGUE = "REQUEST_STATIC_CATALOGUE"
export type  StaticFilesCatalogue     = {
    struct       : string
    LIGAND       : string[],
    TUNNEL_REPORT: boolean,
    CENTERLINE   : boolean
    }[]

export interface _requestStaticFilesCatalogue {type: typeof REQUEST_STATIC_CATALOGUE, catalogue:StaticFilesCatalogue}
export const A_requestStaticFilesCatalogue = (catalogue:StaticFilesCatalogue):_requestStaticFilesCatalogue =>({
    type: REQUEST_STATIC_CATALOGUE,
    catalogue
})

export type UtilitiesActions = _requestStaticFilesCatalogue