import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { NeoStruct } from "../redux/reducers/Data/StructuresReducer/StructuresReducer";
import { AppState } from "../redux/store";
import * as redux from "./../redux/reducers/Data/StructuresReducer/StructuresReducer";
import "./Home.css";
import { Link } from "react-router-dom";

import bioplogo from "./../static/biopython_logo.svg";
import pdb from "./../static/pdb.png";
import pfam from "./../static/pfam.gif";
import raylogo from "./../static/ray-transp-logo.png";
import ubc from "./../static/ubc-logo.png";
import InlineSpinner from "./Other/InlineSpinner";

import { Accordion, Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { large_subunit_map } from "./../static/large-subunit-map";
import { small_subunit_map } from "./../static/small-subunit-map";
import fileDownload from "js-file-download";
import { ReactMarkdownElement, md_files } from "./Other/ReactMarkdownElement";
import Axios from "axios";

const AcknPlug: React.FC<{ text: string }> = ({ text, children }) => {
  return <div className="group-plug">{children}</div>;
};

interface OwnProps {}
interface ReduxProps {
  __rx_structures: NeoStruct[];
}
interface DispatchProps {
  // __rx_requestStructures: () => void;
  // filterOnPdbid         : (x:string)=>void;
  // filterOnSpeciesId     : (x:number[])=>void;
}
type HomeProps = DispatchProps & OwnProps & ReduxProps;

const Home: React.FC<HomeProps> = (prop: HomeProps) => {


  var [structn, setstructn] = useState<number>(0);
  var [protn, setProtn]     = useState<number>(0);
  var [rnan, setrnan]       = useState<number>(0);
  var [xray, setxray]       = useState<number>(0);
  var [em, setem]           = useState<number>(0);

  useEffect(() => {

    var structs = prop.__rx_structures;
    var prot    = 0;
    var rna     = 0;
    var struct  = 0;
        struct  = structs.length;

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

  const [mds, setmds] = useState<string[]>([]);

  useEffect(() => {
    Axios.all([
      ...Object.values(md_files.all.home).map(url => Axios.get(url)),
    ]).then(r => setmds(r.map(resp => resp.data)));
  }, []);

  return (
    <div className="homepage">
      <div className="stats area">

        <div id="stats-proper">
          <div>
            <img id="teg" src={raylogo} alt="teg" />
          </div>

          <div>
            <h4>Resource Summary: </h4>
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
              <Link to="/structs">structures:</Link>{" "}
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
              <p className="in-dev">
                This is still in active development phase. All usability and
                conceptual suggestions would be very much appreciated. Thanks
                for getting in touch at{" "}
                <a href="mailto:rtkushner@gmail.com">rtkushner@gmail.com</a>!
              </p>
            </div>
            <img id="ubclogo" className="footerimg" src={ubc} alt="ubc" />
          </AcknPlug>
        </div>
      </div>
      <div className="mods area">
        <h4>Overview of tools and data we provide.</h4>
        <ReactMarkdownElement md={md_files.all.home.prots} />
        <ReactMarkdownElement md={md_files.all.home.ligs} />
        <ReactMarkdownElement md={md_files.all.home.exittunnel} />
        <ReactMarkdownElement md={md_files.all.home.rna} />
        <ReactMarkdownElement md={md_files.all.home.limitations} />
      </div>
    </div>
  );
};

const ModsCard: React.FC<{ togglename: string; activekey: string }> = ({
  children,
  togglename,
  activekey,
}) => {
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle
          id="mod-header"
          as={Button}
          variant="link"
          eventKey={activekey}
        >
          {togglename}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={activekey}>
        <Card.Body>{children}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.structures.derived_filtered
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps): DispatchProps => ({
  __rx_requestStructures: () => dispatch(redux.requestAllStructuresDjango()),
});

export default connect(mapstate, mapdispatch)(Home);
