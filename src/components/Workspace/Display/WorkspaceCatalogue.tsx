import React, { useEffect, useState } from "react";import "./WorkspaceCatalogue.css";
import { connect  } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState, rootReducer } from "./../../../redux/store";
import StructHero from "./../StructureHero/StructHero";
import { PageContext } from "../../Main";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import * as redux from './../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { method } from "lodash";

interface OwnProps {}
interface ReduxProps {
  __rx_structures: redux.NeoStructResp[]
  globalFilter   : string;
  loading        : boolean;

}
interface DispatchProps {
  __rx_requestStructures: () => void,
}
type WorkspaceCatalogueProps = DispatchProps & OwnProps & ReduxProps;
export const parseKingdomOut = (speciesstr: string) => {
  return speciesstr.slice(-3).replace(/(\(|\))/g, "");
};

const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (
  prop: WorkspaceCatalogueProps
) => {

	useEffect(() => {
		prop.__rx_requestStructures()
	}, [])

	// Tis has to be all moved to the reducer
	const [structures, setstructures] = useState<redux.NeoStructResp[]>([])
	useEffect(()=>{
		setstructures(prop.__rx_structures)
	},[prop.__rx_structures])

  const filterByPdbId =(structs:redux.NeoStructResp[], filter:string) =>{
    return structs.filter(x=> x.struct.rcsb_id.toLowerCase().includes(filter))
  }

  const [organismsAvailable, setorganismsAvailable] = useState({})

  useEffect(() => {
    var organisms = structures.map(str => {
      return {
        name: str.struct._organismName.map(x => x.toLowerCase()),
        id: str.struct._organismId,
      };
    });
    const orgsdict: { [id: string]: string[] } = {};

    organisms.map(org => {
      org.id.forEach((id, index) => {
        if (!Object.keys(orgsdict).includes(id.toString())) {
          orgsdict[id] = []
          orgsdict[id].push(org.name[index])
        }else{
          orgsdict[id].push(org.name[index])
        }
      });
    });

    setorganismsAvailable(orgsdict)
    
  }, [structures]);


  const [methodFilter, setmethodFilter] = useState<string[]>([])

  useEffect(() => {

	if (methodFilter.length ===0){
		setstructures(prop.__rx_structures)
		return
	}

	var filtered = structures.filter(struct => methodFilter.includes(struct.struct.expMethod));
	setstructures(filtered)

  }, [methodFilter]);


  const [organismFilter, setorganismFilter] = useState<string[]>([]);

  const filterByOrganism = (struct: redux.NeoStructResp) => {
	  if (organismFilter.length <1 ) return true
    for (var id of struct.struct._organismId) {
      if (organismFilter.includes(id.toString())) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
	  console.log(organismFilter)
  }, [organismFilter])

  const [pdbidFilter, setPbidFilter] = useState<string>("");
  return !prop.loading ? (
    <PageContext.Provider value="WorkspaceCatalogue">
      <div className="workspace-catalogue-grid">
        <div className="wspace-catalogue-filters-tools">
          Search:{" "}
          <input
            value={pdbidFilter}
            onChange={e => {
              setPbidFilter(e.target.value);
            }}
          />
          <li>
            ELECTRON MICROSCOPY
            <input
              id="ELECTRON MICROSCOPY"
              onChange={e => {
                var id = e.target.id;
                console.log(e.target.checked);
                if (e.target.checked) {
                  setmethodFilter([...methodFilter, id]);
                } else {
                  setmethodFilter(methodFilter.filter(str => str != id));
                }
              }}
              type="checkbox"
            />
          </li>
          <li>
            X-RAY DIFFRACTION
            <input
              id="X-RAY DIFFRACTION"
              type="checkbox"
              onChange={e => {
                var id = e.target.id;
                if (e.target.checked) {
                  setmethodFilter([...methodFilter, id]);
                } else {
                  setmethodFilter(methodFilter.filter(str => str != id));
                }
              }}
            />
          </li>
          <br />
          {Object.entries(organismsAvailable).map((tpl: any) => {
            return (
              <li>
                {tpl[0]}({tpl[1][0]})
                <input
                  onChange={e => {
                    var checked = e.target.checked;
                    var id      = e.target.id;
                    if (!checked) {
                      setorganismFilter(
                        organismFilter.filter(str => !(str.toString() == id))
                      );
                    } else {
                      setorganismFilter([...organismFilter, id.toString()]);
                    }
                  }}
                  type="checkbox"
                  id={tpl[0]}
                />
              </li>
            );
          })}
          <div></div>
        </div>
        <div className="workspace-catalogue-structs">
          {filterByPdbId(structures.filter(filterByOrganism), pdbidFilter).map((x, i) => (
            <StructHero {...x} key={i} />
          ))}
        </div>
      </div>
    </PageContext.Provider>
  ) : (
    <LoadingSpinner />
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.Data.RibosomeStructures.StructuresResponse,
  loading        : state.Data.RibosomeStructures.Loading,
  globalFilter   : state.UI.state_Filter.filterValue,
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({
  __rx_requestStructures: ()=> dispatch(redux.requestAllStructuresDjango())
});

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);
