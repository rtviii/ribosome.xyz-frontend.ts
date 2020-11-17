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

import bioplogo from './../static/biopython_logo.svg'
import pdb from './../static/pdb.png'
import pfam from './../static/pfam.gif'
import ubc from './../static/ubc-logo.png'
import teg from './../static/tegunovM.gif'

import tunnel from './../static/tunnel.png'
import overview from './../static/overview.png'
import ban from './../static/ban.png'
import loading from './../static/loading.gif'
import InlineSpinner from './Other/InlineSpinner'

import { Accordion, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';



const AcknPlug:React.FC<{text:string}> = ({text, children})=>{
  return (
    <div id="group-plug">
      <p>{text}</p>
      {children}
      {/* <div className="txt">
        <p>
          Developed by the <a href="https://kdaoduc.com/">KDD group</a> at
          theUniversity of British Columbia.
        </p>
        <p>
          In collaboration with{" "}
          <a href="https://ww2.chemistry.gatech.edu/~lw26/">
            Loren Williams' group
          </a>{" "}
          at Georgia Institute of Technology.
        </p>
      </div>
      <img id="ubclogo" src={ubc} alt="ubc" /> */}
    </div>
  );
}


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
      <div className="stats area">
        <div id="stats-proper">
          <div>
            <img id="teg" src={teg} alt="teg" />
          </div>

          <div>
            <h4>Resource Summary:</h4>
            <li>
              <b>{protn ? protn : <InlineSpinner />}</b> unique{" "}
              <Link to="/rps">ribosomal proteins</Link>
            </li>
            <li>
              <b>{rnan ? rnan : <InlineSpinner />}</b>{" "}
              <Link to="/rnas">rRNA</Link>
            </li>
            <li>
              <b>{structn ? structn : <InlineSpinner />}</b> ribosome{" "}
              <Link to="/catalogue">structures</Link>{" "}
            </li>
            <li>
              <b>{em ? em : <InlineSpinner />}</b> ElectronMicroscopy |{" "}
              <b>{xray ? xray : <InlineSpinner />}</b> X-Ray Diffraction
            </li>
          </div>
        </div>

        <div className="relmats">
          <h4>Relevant Materials</h4>
          <ul>
            <li>
              <a href={"https://www.mdpi.com/1420-3049/25/18/4262"}>
                Structural Heterogeneities of the Ribosome: New Frontiers and
                Opportunities for Cryo-EM
              </a>
            </li>
          </ul>

          <div className="acknowledgements">
            <h4>Acknowlegements</h4>
            <p>
              Crystallographic strucutures and some of the annotations are
              acquired from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>
            </p>
            <p>
              Parsing and search are performed via{" "}
              <a href="https://biopython.org/">Biopython.PDB</a>
            </p>
            <p>
              <a href="https://pfam.xfam.org/">PFAM</a> Database provides
              context for grouping ribosomal proteins into families.
            </p>
            <p>
              <a href="https://data.rcsb.org/index.html#gql-api">RCSB GQL</a>{" "}
              greatly faciliatates the integration of data across structures
            </p>
            <p>
              <a href="https://academic.oup.com/nar/article/46/W1/W368/4990029">
                MOLE
              </a>{" "}
              algorithm is used to extract features of the exit tunnel
            </p>
          </div>

          <div id="logos">
            <img className="footerimg" src={bioplogo} alt="bioplog" />
            <img className="footerimg" src={pfam} alt="pfam" />
            <img className="footerimg" src={pdb} alt="pdb" />
          </div>

<AcknPlug text="yellow"/>

          <div id="kddgroup">
            <div className="txt">
              <p>
                Developed by the <a href="https://kdaoduc.com/">KDD group</a> at
                theUniversity of British Columbia.
              </p>
              <p>
                In collaboration with{" "}
                <a href="https://ww2.chemistry.gatech.edu/~lw26/">
                  Loren Williams' group
                </a>{" "}
                at Georgia Institute of Technology.
              </p>
            </div>
            <img id="ubclogo" src={ubc} alt="ubc" />
          </div>
        </div>
      </div>


      <div className="mods area">
        <h4>Overview of tools and data we provide.</h4>
        <Accordion id="mods-acc">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Ribosomal Proteins
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <p className="rrr">
                  A programmatic conversion mechanism based on protein families
                  is implemented toenforce standard ribosomal protein
                  nomenclature. We thus classify proteins, as wellas rRNA and
                  ligands that figure in the PDB depositions and make their
                  individual ex-port as a standalone.ciffile available
                </p>
                <img id="conversion" src={conversion} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                mRNA, tRNA, Init. factors
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <p className="rrr">
                  A centralized resource to search, access and compare
                  individual rRNA strands across a variety of structures
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Ligand Binding Sites
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <p className="rrr">
                  Crystallographic models frequently feature ligands and small
                  molecules that are not intrinsic to the ribosome but are still
                  of great interest whether due to their pharmacological,
                  evolutionary or other import. We provide a residue-level
                  catalogu of ligands, small molecules and antibiotics and their
                  physical neighborhood as well as tools to search for similar
                  molecules across other structures in the database.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Exit Tunnels
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <p>
                  <p className="rrr">
                    Ribosome exit tunnel, peptidyl-transferase center are of
                    particular interest in the exploration of the translation
                    process and evolutionary modifications in different species.
                    We gather a selection of exit-tunnel replicas from the
                    available structures in the hopes of further extending this
                    dataset in the future.
                  </p>
                </p>
                <img id="tunnel" src={tunnel} alt="tunnel" />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
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
  __rx_requestStructures: () => dispatch(redux.requestAllStructuresDjango()),
});
export default connect(mapstate, mapdispatch)(Home);
