import React, { useState, useEffect } from "react";
import {  flattenDeep} from "lodash";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import "./RPsCatalogue.css";
import { BanClass } from "../../../redux/RibosomeTypes";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import BanClassHero from './BanClassHero'
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import LoadingSpinner from "../../Other/LoadingSpinner";
import PageAnnotation from "../Display/PageAnnotation";
import Grid from "@material-ui/core/Grid";


const pageData={

  title:"Ribosomal Proteins",
  text:"To enable comprehensive comparison of structures deposited by the community in to the RCSB/PDB,\
   we have provided a common ontology that allows to get access to the structure of ribosomal proteins across\
    multiple files, by refering to their standard names \
   This ontology is notably based on a nomenclature that was recently adopted for naming ribosomal proteins."
}

export interface ERS {
  nom_class  :  BanClass;
  presentIn  :  Array<string>;
  rps              : Array<{        
    organism_desc: string
    organism_id  : number
    uniprot      : string
    parent       : string
    parent_reso  : number
    strand_id    : string
  }>
}

export interface BanPaperEntry{
        pfamDomainAccession: Array<string>;
        taxRange           : Array<string>;
        b                  : string| null;
        y                  : string | null;
        h                  : string | null;
}

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}
type RPsCatalogueProps = DispatchProps & OwnProps & ReduxProps;

const sortProts = (p1:ERS,p2:ERS) =>{

  var a = p1.nom_class
  var b = p2.nom_class

  const convert = ( letr:string)=>{
    switch(letr){
      case 'b':
        return 1
      case 'e':
        return 2
      case 'u':
        return 3
      default:
        return 0
    }
  }
  var cl1 =convert( a.slice(0,1) )
  var cl2 =convert( b.slice(0,1) )
  if(cl1 === cl2){
    var numa = a.match(/\d+/g)![0] as unknown as number;
    var numb = b.match(/\d+/g)![0] as unknown as  number;
    return numa-numb
  }
  return cl1 - cl2
}

const RPsCatalogue: React.FC<RPsCatalogueProps> = (prop: RPsCatalogueProps) => {

  const [available, setavailable] = useState<Array<ERS>>([]);
  const [ssu, setssu]             = useState<Array<ERS>>([]);
  const [lsu, setlsu]             = useState<Array<ERS>>([]);
  const [other, setother]         = useState<Array<ERS>>([]);
  const [activecat, setactivecat] = useState("lsu");

  const KingdomGrid = ({
    prots,
    map,
  }: {
    prots: ERS[];
    map  : Record<string, BanPaperEntry>
  }) => {
    const [kb, setkb] = useState<ERS[]>([]);
    const [ke, setke] = useState<ERS[]>([]);
    const [ku, setku] = useState<ERS[]>([]);
    useEffect(() => {
      var u = prots.filter(x => x.nom_class.match(/^u/));
      var b = prots.filter(x => x.nom_class.match(/^e/));
      var e = prots.filter(x => x.nom_class.match(/^b/));
      setkb(b);
      setku(u);
      setke(e);
    }, [prots]);

    return (
        <Grid container xs={12}>

        <PageAnnotation  {...pageData}/>
        
        <Grid item xs={4} container>
        <div id="e">
          <h4>Eukaryotic</h4>
          <div className="kingdom-tray">
            {kb.map(x => {
              return <BanClassHero prop={x}  paperinfo={map[x.nom_class]}/>;
            })}
          </div>
        </div>

        </Grid>
        <Grid item xs={4} container>
        <div id="b">
          <h4>Bacterial</h4>
          <div className="kingdom-tray">
            {ke.map(x => {
              return <BanClassHero prop={x}  paperinfo={map[x.nom_class]}/>;
            })}{" "}
          </div>
        </div>

        </Grid>
        <Grid item xs={4} container>

        <div id="u">
          <h4>Universal</h4>
          <div className="kingdom-tray">
            {ku.map(x => {
              return <BanClassHero prop={x}  paperinfo={map[x.nom_class]}/>;
            })}{" "}
          </div>
        </div>
        </Grid>
        </Grid>
    );
  };

  const renderSwitchSubunit = (category: string) => {
    switch (category) {
      case "lsu":
        return (
          <div className="rps-subunit-tray">
              <KingdomGrid prots={lsu} map={large_subunit_map}/>
          </div>
        );
      case "ssu":
        return (
          <div className="rps-subunit-tray">
              <KingdomGrid prots={ssu} map={small_subunit_map}/>
          </div>
        );
      case "other":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">Other</h2>
            <div className='subunit-members'>
            {other
              .filter(x =>
                x.nom_class.toLowerCase().includes(prop.globalFilter))
              .sort()
              .map(x => {
              return <BanClassHero prop={x}  paperinfo={{ b:"",h:"",pfamDomainAccession:[], taxRange:[],y:""}}/>;
              })}
              </div>
          </div>
        );
      default:
        return "Something went wrong in the render switch.";
    }
  };
  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_nom_classes",
      params: null,
    }).then(response => {

      var uniquerps: Array<any> = flattenDeep(response.data);

      setavailable(uniquerps);
      setlsu(
        uniquerps.filter(x => {
          return (
            x.nom_class.includes("L") && !x.nom_class.includes("S")
          );
        }).sort(sortProts)
      );

      setssu(
        uniquerps.filter(x => {
          return (x.nom_class.includes("S") && !x.nom_class.includes("L"));
        }).sort(sortProts)
      );

      setother(
        uniquerps.filter(x => {
          return ["RACK1", "bTHX"].includes(x.nom_class);
        })
      );
    });
    return () => {};
  }, []);
  return (
    <div className="rps-catalogue">
      <div className="filters-tools-rps">
          <div
            onClick={() => setactivecat("lsu")}
            className={activecat === "lsu" ? "activecat" : "cat"}>
            Large Subunit
          </div>
          <div
            onClick={() => setactivecat("ssu")}
            className={activecat === "ssu" ? "activecat" : "cat"}>
            Small Subunit
          </div>
          <div
            onClick={() => setactivecat("other")}
            className={activecat === "other" ? "activecat" : "cat"}>
            Other
          </div>
      </div>
      <div className="rps-catalogue-classes">
        { available.length > 1 ?  renderSwitchSubunit(activecat):<LoadingSpinner annotation='Loading ...'/>}
      </div>
    </div>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: ""
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(RPsCatalogue);
