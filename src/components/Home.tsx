import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../redux/AppActions';
import { NeoStructResp } from '../redux/reducers/Data/StructuresReducer/StructuresReducer';
import { AppState } from '../redux/store';
import * as redux from './../redux/reducers/Data/StructuresReducer/StructuresReducer'
import  conversion from './../static/conversion.png'
import './Home.css'
import { Link } from 'react-router-dom'
import LoadingSpinner from './Other/LoadingSpinner';


interface OwnProps {}
interface ReduxProps {
    __rx_structures: NeoStructResp[]
}
interface DispatchProps {
     __rx_requestStructures: () => void, 
}
type HomeProps = DispatchProps & OwnProps & ReduxProps;

const Home: React.FC<HomeProps> = (prop: HomeProps) => {
  useEffect(() => {
    prop.__rx_requestStructures();
  }, []);

  var [structn, setstructn] = useState<number>(0);
  var [protn, setProtn]     = useState<number>(0);
  var [rnan, setrnan]       = useState<number>(0);
  var [xray, setxray]       = useState<number>(0);
  var [em, setem]           = useState<number>(0);

  // var emn:number = 0;
  // var xrayn:number = 0;

  useEffect(() => {
    var structs = prop.__rx_structures;
    console.log(structs);

    var prot = 0;
    var rna = 0;
    var struct = 0;
    struct = structs.length;
    for (var str of structs) {
      prot += str.rps.length;
      rna += str.rnas.length;
    }

    setProtn(prot);
    setrnan(rna);
    setstructn(struct);

    var xray = 0;
    var em = 0;
    structs.map(struct => {
      if (struct.struct.expMethod === "X-RAY DIFFRACTION") {
        xray += 1;
      } else if (struct.struct.expMethod === "ELECTRON MICROSCOPY") {
        em += 1;
      }
    });
    setxray(xray);
    setem(em);
  }, [prop.__rx_structures]);

  return (
    <div className="homepage">
      <div id="stats">
        <h2>The database contains:</h2>

        {structn === 0 ? (
          <LoadingSpinner annotation=''/>
        ) : (
          <div>
            <p>
              <b>{protn}</b> unique <Link to="/rps">ribosomal protein</Link>s
              and <b>{rnan}</b> <Link to="/rnas">rRNA</Link> across
            </p>
            <p>
              <b>{structn}</b> <Link to="/catalogue">structures</Link> :{" "}
              <b>{em}</b> ElectronMicroscopy | <b>{xray}</b> X-Ray Diffraction
            </p>
          </div>
        )}
      </div>
      <img id="conversion" src={conversion} />




{/* stats:
rna
proteins
average resolution
    */}

{/* references

acknowledgements: 
ribovision
Mole
rcsb-gql */}

{/* 
Collaboration thesis
*/}

{/* 
footer: 
khanh dao-duc's lab
ubc
rcsb, pfam, uniprot
 */}
      <div className="content">
        <div className="related-materials">
          <h2>Relevant Materials</h2>
          <ul>
            <li>
              <a href={"https://www.mdpi.com/1420-3049/25/18/4262"}>
                Structural Heterogeneities of the Ribosome: New Frontiers and
                Opportunities for Cryo-EM
              </a>
            </li>
          </ul>
        </div>
        <div className="acknowledgements"></div>
        <h2>Acknowlegements</h2>
        <p>
          Crystallographic strucutures and some of the annotations are acquired
          from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>
        </p>
        <p>
          Parsing and search are performed via{" "}
          <a href="https://biopython.org/">Biopython.PDB</a>
        </p>
      </div>
    </div>
  );
};


const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.Data.RibosomeStructures.StructuresResponse,
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({
  __rx_requestStructures: ()=> dispatch(redux.requestAllStructuresDjango())
});
export default connect(mapstate, mapdispatch)(Home);
