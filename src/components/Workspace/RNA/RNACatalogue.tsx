import { flattenDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import LoadingSpinner from "../../Other/LoadingSpinner";
import RNAHero from "./RNAHero";
import "./RNACatalogue.css";
import PageAnnotation from "./../Display/PageAnnotation";
import Grid from "@material-ui/core/Grid";
import { RNAProfile } from "./../../../redux/DataInterfaces";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import RNACard from "./RNACard";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import { SearchField, SpeciesList } from "../Display/StructuresCatalogue";
import Pagination from "../Display/Pagination";
import { AppState } from "../../../redux/store";
import { filterChange, FilterData } from "../../../redux/reducers/Filters/ActionTypes";
import { connect } from "react-redux";
import { AppActions } from "../../../redux/AppActions";
import { gotopage } from "../../../redux/reducers/RNA/ActionTypes";
import { Dispatch } from "redux";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const pageData = {
  title: "Ribosomal, messenger, transfer RNA",
  text:
    "RNA components, including ribosomal RNA's, but also tRNA's and mRNA's solved\
 with the ribosomes are caccessible and can be searched through all structures.",
};

type  ReduxProps                        = {rna_strands: RNAProfile[], current_page: number, page_total:number}
type  DispatchProps                     = {gotopage: (pid:number)=>void}
const RNACatalogue:React.FC<ReduxProps & DispatchProps> = (prop) => {
  const a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const [trnas, settrna]          = useState<RNAProfile[]>([]);
  const [mrnas, setmrna]          = useState<RNAProfile[]>([]);
  const [class_16s, setclass_16s] = useState<RNAProfile[]>([]);
  const [class_23s, setclass_23s] = useState<RNAProfile[]>([]);
  const [class_5s, setclass_5s]   = useState<RNAProfile[]>([]);
  const [other, setother]         = useState<RNAProfile[]>([]);

  const filterByClass = (rnas: RNAProfile[], kwords: RegExp) => {
    return rnas.filter(r => {
      const desc = r.rna.rcsb_pdbx_description!.toLowerCase();
      if (kwords.test(desc)) {
        return true;
      } else return false;
    });
  };


  useEffect(() => {
    var rnas = prop.rna_strands
    var class_23s = filterByClass(rnas, /23 s|23s|23-s|28s|28 s|28-s/);
    var mrna      = filterByClass(rnas, /m-rna|messenger|mrna/);
    var trna      = filterByClass(rnas, /t-rna|transfer|trna/);
    var class_16s = filterByClass(rnas, /16 s|16s|16-s|18s|18 s|18-s/);
    var class_5s  = filterByClass(
      rnas,
      /(?<!2)5 s|(?<!2)5s|(?<!2)5-s|5.8s|5.8 s/
    );
    var other = rnas.filter(
      el =>
        ![...mrna, ...trna, ...class_16s, ...class_23s, ...class_5s].includes(
          el
        )
    );

    setclass_23s(class_23s);
    setmrna(mrna);
    settrna(trna);
    setclass_16s(class_16s);
    setclass_5s(class_5s);
    setother(other);
  }, [prop.rna_strands]);



  // -------------------------------------
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  // -------------------------------------
  return (
    <Grid container xs={12}>
      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid container item xs={2}>
          <List>
            <ListSubheader>Species</ListSubheader>
            <ListItem>
              <SpeciesList />
            </ListItem>

            <Divider />
            <ListItem>
              <SearchField />
            </ListItem>
            <DashboardButton/>
          </List>
      </Grid>

      <Grid item xs={10} container spacing={1}>
        <Grid item xs={12}>
          <Paper>
            <Tabs
              indicatorColor="primary"
              centered
              value={tabValue}
              onChange={handleTabChange}
            >
              <Tab label = { `23S-like rRNA ${class_23s.length > 0 ? "("+class_23s.length+")": ""}` } {...a11yProps(0)} />
              <Tab label = { `16S-like rRNA ${class_16s.length > 0 ? "("+class_16s.length+")": ""}` } {...a11yProps(1)} />
              <Tab label = { `5S-like rRNA ${class_5s.length > 0 ? "("+class_5s.length+")": ""}` }    {...a11yProps(2)} />
              <Tab label = { `mRNA ${mrnas.length > 0 ? "("+mrnas.length+")": ""}` }                  {...a11yProps(3)} />
              <Tab label = { `tRNA ${trnas.length > 0 ? "("+trnas.length+")": ""}` }                  {...a11yProps(4)} />
              <Tab label = { `uncategorized ${other.length > 0 ? "("+other.length+")": ""}` }         {...a11yProps(5)} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( class_23s.length/20 ) }}
              />
                {class_23s.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( class_16s.length/20 ) }}
              />
                {class_16s.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( class_5s.length/20 ) }}
              />
                {class_5s.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( mrnas.length/20 ) }}
              />
                {mrnas.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( trnas.length/20 ) }}
              />
                {trnas.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <Grid container xs={12} spacing={2}>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: Math.ceil( other.length/20 ) }}
              />
                {other.slice((prop.current_page - 1) * 20, prop.current_page * 20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapstate = (appstate:AppState, ownprops:any):ReduxProps =>({
  rna_strands : appstate.rna.all_rna_derived,
  page_total  : appstate.rna.pages_total,
  current_page: appstate.rna.current_page,
})
const mapdispatch = ( dispatch:Dispatch<AppActions>, ownprops:any):DispatchProps =>({
  gotopage:(pid) => dispatch(gotopage(pid))
})
export default connect(mapstate, mapdispatch)( RNACatalogue );
