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
    <div className="group-plug">
        {children}
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

    var prot   = 0;

    var rna    = 0;

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
            <figcaption id="title-figcap">Tegunov M</figcaption>
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
              <b>{em ? em : <InlineSpinner />}</b> ElectronMicroscopy
            </li>
            <li>
              <b>{xray ? xray : <InlineSpinner />}</b> X-Ray Diffraction
            </li>
          </div>
        </div>

        <div className="relmats">
          <h4>Relevant Materials</h4>
          <ul>
            {[
              [
                "https://www.mdpi.com/1420-3049/25/18/4262",
                "Structural Heterogeneities of the Ribosome: New Frontiers and Opportunities for Cryo-EM",
              ],
              [
                "https://bangroup.ethz.ch/research/nomenclature-of-ribosomal-proteins.html",
                "New System for Naming Ribosomal Proteins",
              ],
            ].map(pub => (
              <li>
                <a href={pub[0]}>{pub[1]}</a>
              </li>
            ))}
          </ul>

          <div className="acknowledgements">
            <h4>Acknowlegements</h4>
            <AcknPlug text="">
              <div>
                <p>
                  Crystallographic strucutures and some of the annotations are
                  acquired from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>
                </p>
                <p>
                  <a href="https://data.rcsb.org/index.html#gql-api">
                    RCSB GQL
                  </a>{" "}
                  greatly faciliatates the integration of data across structures
                </p>
              </div>
              <img className="footerimg" src={pdb} alt="pdb" />
            </AcknPlug>

            <AcknPlug text="">
              <p>
                Parsing and search are performed via{" "}
                <a href="https://biopython.org/">Biopython.PDB</a>
              </p>
              <img className="footerimg" src={bioplogo} alt="bioplog" />
            </AcknPlug>
            <AcknPlug text="">
              <p>
                <a href="https://pfam.xfam.org/">PFAM</a> Database provides
                context for grouping ribosomal proteins into families.
              </p>
              <img className="footerimg" src={pfam} alt="pfam" />
            </AcknPlug>
            <AcknPlug text="">
              <p>
                <a href="https://academic.oup.com/nar/article/46/W1/W368/4990029">
                  MOLE
                </a>{" "}
                software is used to extract the ribosomal exit tunnel.
              </p>
            </AcknPlug>

            <AcknPlug text="yellow">
              <div className="ubc-gatech">
                <p>
                  Developed by the <a href="https://kdaoduc.com/">KDD group</a>{" "}
                  at the University of British Columbia.
                </p>
                <p>
                  In collaboration with{" "}
                  <a href="https://ww2.chemistry.gatech.edu/~lw26/index.html#PI">
                    Loren Williams' group
                  </a>{" "}
                  at Georgia Institute of Technology.
                </p>
              </div>
              <img id="ubclogo" className="footerimg" src={ubc} alt="ubc" />
            </AcknPlug>
          </div>
        </div>
      </div>

      <div className="mods area">
        <h4>Overview of tools and data we provide.</h4>
        <Accordion id="mods-acc">

          <ModsCard togglename={"Ribosomal Proteins"}>
            <p className="rrr">
              A programmatic conversion mechanism based on protein families is
              implemented toenforce standard ribosomal protein nomenclature. We
              thus classify proteins, as wellas rRNA and ligands that figure in
              the PDB depositions and make their individual ex-port as a
              standalone.ciffile available
            </p>
            <img id="conversion" src={conversion} />
          </ModsCard>

          <ModsCard togglename={"rRNA(23s,16,5s), mRNA, tRNA"}>
            <p className="rrr">
                  A centralized resource to search, access and compare
                  individual rRNA strands across a variety of structures
            </p>
          </ModsCard>

          <ModsCard togglename={"Ligands, Antibiotics, Ions, Small Molecules"}>
            <p className="rrr">
              Crystallographic models frequently feature ligands and small
              molecules that are not intrinsic to the ribosome but are still of
              great interest whether due to their pharmacological, evolutionary
              or other import. We provide a residue-level catalogu of ligands,
              small molecules and antibiotics and their physical neighborhood as
              well as tools to search for similar molecules across other
              structures in the database.
            </p>
          </ModsCard>

          <ModsCard togglename={"Exit tunnel"}>
            <p className="rrr">
              Ribosome exit tunnel, peptidyl-transferase center are of
              particular interest in the exploration of the translation process
              and evolutionary modifications in different species. We gather a
              selection of exit-tunnel replicas from the available structures in
              the hopes of further extending this dataset in the future.
            </p>
            <img id="tunnel" src={tunnel} alt="tunnel" />
          </ModsCard>
        </Accordion>
      </div>
    </div>
  );
};


const ModsCard: React.FC<{ togglename: string }> = ({
  children,
  togglename,
}) => {
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Button} variant="link" eventKey="1">
          {togglename}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey="1">
        <Card.Body>
          {children}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
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
