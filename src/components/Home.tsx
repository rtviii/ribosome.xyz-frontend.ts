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
import fig1 from './../static/review_fig.svg'

import tunnel from './../static/tunnel.png'
import overview from './../static/overview.png'
import ban from './../static/ban.png'
import loading from './../static/loading.gif'
import InlineSpinner from './Other/InlineSpinner'

import { Accordion, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import {large_subunit_map} from './../static/large-subunit-map'
import {small_subunit_map} from './../static/small-subunit-map'

import Lightbox from 'react-image-lightbox';
import fileDownload from 'js-file-download';
 


// Tunnel tab
// Home mods summaries
// Ribovision summary for proteins
// Exposition on the graph structure
// More elaborate filters


const AcknPlug:React.FC<{text:string}> = ({text, children})=>{
  return (
    <div className="group-plug">
        {children}
    </div>
  );
}


const downloadMap = ()=>{
  const map = {
    ...large_subunit_map,
    ...small_subunit_map
  }

  fileDownload(JSON.stringify(map),"BanNomenclatureMap_v.02.json")

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

  const[isOpen1, setopen1] = useState<boolean>(false)
  const[isOpen2, setopen2] = useState<boolean>(false)
  return (
    <div className="homepage">
      <div className="stats area">
        <div id="stats-proper">
          <div>
            <img id="teg" src={teg} alt="teg" />
            <figcaption id="title-figcap">
              [ Figure from Tegunov. Will replace with own movie ]
            </figcaption>
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
              <Link to="/catalogue">structures:</Link>{" "}
            </li>
            <li id="indent">
              <b>-{em ? em : <InlineSpinner />}</b> ElectronMicroscopy
            </li>
            <li id="indent">
              <b>-{xray ? xray : <InlineSpinner />}</b> X-Ray Diffraction
            </li>
            <li>{"BUFFERING"} ligands and small molecules</li>
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
              [
                "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6486554/",
                "Differences in the path to exit the ribosome across the three domains of life",
              ],
              [
                "https://pubmed.ncbi.nlm.nih.gov/19279186/",
                "A recurrent magnesium-binding motif providesa framework for the ribosomal peptidyltransferase center",
              ],
            ].map(pub => (
              <li>
                <a href={pub[0]}>{pub[1]}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="acknowledgements">
          <h4>Acknowlegements</h4>
          <AcknPlug text="">
            <div>
              <p>
                Crystallographic strucutures and some of the annotations are
                acquired from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>
              </p>
              <p>
                <a href="https://data.rcsb.org/index.html#gql-api">RCSB GQL</a>{" "}
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
              <a href="https://jcheminf.biomedcentral.com/articles/10.1186/1758-2946-5-39">
                MOLE
              </a>{" "}
              software is used to extract the ribosomal exit tunnel.
            </p>
          </AcknPlug>

          <AcknPlug text="yellow">
            <div className="ubc-gatech">
              <p>
                Developed by the <a href="https://kdaoduc.com/">KDD group</a> at
                the University of British Columbia.
              </p>
              <p>
                In collaboration with{" "}
                <a href="https://ww2.chemistry.gatech.edu/~lw26/index.html#PI">
                  Loren Williams' group
                </a>{" "}
                at Georgia Institute of Technology.
              </p>
              <p className='in-dev'> 
              This is still in active development phase.
              All usability and conceptual suggestions would be very much appreciated.
              Thanks for getting in touch at <a href='mailto:rtkushner@gmail.com'>rtkushner@gmail.com</a>!
              </p>
            </div>
            <img id="ubclogo" className="footerimg" src={ubc} alt="ubc" />
          </AcknPlug>
        </div>
      </div>
      <div className="mods area">
        <h4>Overview of tools and data we provide.</h4>
        <Accordion id="mods-acc" defaultActiveKey="1">
          <ModsCard
            togglename={"Ribosomal Proteins: Classification, Search, Export"}
            activekey={"1"}
          >
            <div className="mod-card-body">
              <p className="rrr">
                In order to enable comprehensive comparison of structures
                deposited by the community in to the RCSB/PDB, a common ontology
                is required for comparing proteins and the data associated with
                them across multiple files(Fig. 1). One solution is to refer to
                Uniprot accession codes and/or InterPro families of the
                proteins, but the naming of ribosomal proteins presents a
                specific obstacle for data integration. Due to historical
                contingency, many ribosomal proteins from different species were
                originally assigned the same name, despite being often unrelated
                in structure and function. To eliminate confusion, a
                nomenclature has been proposed to standardize known ribosomal
                protein names and provide a framework for novel ones. While this
                nomenclature has been mostly adopted in recent structural
                studies, PFAM families and UniProt database as well as PDB still
                contain numerous references to earlier naming systems.
              </p>

              <div className="modfig">
                <img
                  id="fig1"
                  src={fig1}
                  onClick={() => {
                    setopen1(true);
                  }}
                />
                <figcaption id="title-figcap">Fig. 1</figcaption>
              </div>
              {isOpen1 && (
                <Lightbox
                  reactModalStyle={{ content: { backgroundColor: "white" } }}
                  mainSrc={fig1}
                  nextSrc={fig1}
                  prevSrc={fig1}
                  onCloseRequest={() => setopen1(false)}
                  onMovePrevRequest={() => {}}
                  onMoveNextRequest={() => {}}
                />
              )}
              <p className="rrr">
                A semi-programmatic{" "}
                <Link to="/rpnomenclature">conversion mechanism</Link> based on{" "}
                <a href="https://pfam.xfam.org/">protein families</a> is
                implemented to enforce standard ribosomal protein nomenclature.
                The classification is based on <span id="mapdown" onClick={()=>{downloadMap()}}>the mapping</span> from protein families
                to the proposed nomenclature classes. There remains a need for
                manual curation of the resulting nomenclature given the
                inclusive nature of certain protein families. Nevertheless, we
                urge users and authors of the future depostions to adopt
                firsthand the naming system described in{" "}
                <a href="https://bangroup.ethz.ch/research/nomenclature-of-ribosomal-proteins.html">
                  Ban et al
                </a>
                .
              </p>

              <div className="modfig">
                <img
                  id="conversion"
                  src={conversion}
                  onClick={() => {
                    setopen2(true);
                  }}
                />
                <figcaption id="title-figcap">Fig. 2</figcaption>
                {isOpen2 && (
                  <Lightbox
                    reactModalStyle={{ content: { backgroundColor: "white" } }}
                    mainSrc={conversion}
                    nextSrc={conversion}
                    prevSrc={conversion}
                    onCloseRequest={() => setopen2(false)}
                    onMovePrevRequest={() => {}}
                    onMoveNextRequest={() => {}}
                  />
                )}
              </div>
            </div>
          </ModsCard>

          <ModsCard togglename={"Ribosome Exit Tunnel  "} activekey={"4"}>
            <div className="mod-card-body">
              <p className="rrr">
                Ribosome exit tunnel, peptidyl-transferase center are of
                particular interest in the exploration of the translation
                process and evolutionary modifications in different species. We
                gather a selection of exit-tunnel replicas from the available
                structures in the hopes of further extending this dataset in the
                future.
              </p>
              <img id="tunnel" src={tunnel} alt="tunnel" />
            </div>
          </ModsCard>
          
          <ModsCard togglename={"rRNA, mRNA, tRNA"} activekey={"2"}>
            <div className="mod-card-body">
              <p className="rrr">
                A centralized resource to search, access and compare individual
                rRNA strands across a variety of structures
              </p>
            </div>
          </ModsCard>

          <ModsCard
            togglename={"Ligands, Antibiotics, Ions, Small Molecules"}
            activekey={"3"}
          >
            <div className="mod-card-body">
              <p className="rrr">
                Crystallographic models frequently feature ligands and small
                molecules that are not intrinsic to the ribosome but are still
                of great interest whether due to their pharmacological,
                evolutionary or other import. We provide a residue-level
                catalogu of ligands, small molecules and antibiotics and their
                physical neighborhood as well as tools to search for similar
                molecules across other structures in the database.
              </p>
            </div>
          </ModsCard>

        </Accordion>
      </div>
    </div>
  );
};


const ModsCard: React.FC<{ togglename: string, activekey:string }> = ({
  children,
  togglename,
  activekey
}) => {
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle id='mod-header' as={Button} variant="link" eventKey={activekey}>
          {togglename}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={activekey}>
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
