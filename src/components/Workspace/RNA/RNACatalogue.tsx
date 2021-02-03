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

const RNACatalogue = () => {
  const a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const [rnas, setrnas] = useState<RNAProfile[]>([]);
  const [trnas, settrna] = useState<RNAProfile[]>([]);
  const [mrnas, setmrna] = useState<RNAProfile[]>([]);
  const [class_16s, setclass_16s] = useState<RNAProfile[]>([]);
  const [class_23s, setclass_23s] = useState<RNAProfile[]>([]);
  const [class_5s, setclass_5s] = useState<RNAProfile[]>([]);
  const [other, setother] = useState<RNAProfile[]>([]);

  const filterByClass = (rnas: RNAProfile[], kwords: RegExp) => {
    return rnas.filter(r => {
      const desc = r.rna.rcsb_pdbx_description!.toLowerCase();
      if (kwords.test(desc)) {
        return true;
      } else return false;
    });
  };

  const [organismFilter, setorganismFilter] = useState<Array<number>>([]);
  useEffect(() => {
    getNeo4jData("neo4j", { endpoint: "get_all_rnas", params: null }).then(
      response => {
        var flattened: RNAProfile[] = flattenDeep(response.data);
        setrnas(flattened);
      }
    );
  }, []);

  useEffect(() => {
    var class_23s = filterByClass(rnas, /23 s|23s|23-s|28s|28 s|28-s/);
    // var mrna      = filterByClass(rnas, /m-rna|messenger|mrna/);
    // var trna      = filterByClass(rnas, /t-rna|transfer|trna/);
    // var class_16s = filterByClass(rnas, /16 s|16s|16-s|18s|18 s|18-s/);
    // var class_5s  = filterByClass(
    //   rnas,
    //   /(?<!2)5 s|(?<!2)5s|(?<!2)5-s|5.8s|5.8 s/
    // );
    // var other = rnas.filter(
    //   el =>
    //     ![...mrna, ...trna, ...class_16s, ...class_23s, ...class_5s].includes(
    //       el
    //     )
    // );

    setclass_23s(class_23s);
    // setmrna(mrna);
    // settrna(trna);
    // setclass_16s(class_16s);
    // setclass_5s(class_5s);
    // setother(other);
  }, [rnas, organismFilter]);

  const [organismsAvailable, setorganismsAvailable] = useState({});

  useEffect(() => {
    var organisms = rnas.map(str => {
      return {
        name: str.orgname.map(x => x.toLowerCase()),
        id: str.orgid,
      };
    });

    const orgsdict: { [id: string]: { names: string[]; count: number } } = {};
    organisms.map(org => {
      org.id.forEach((id: number, index: number) => {
        if (!Object.keys(orgsdict).includes(id.toString())) {
          orgsdict[id] = {
            names: [],
            count: 1,
          };
          orgsdict[id].names.push(org.name[index]);
        } else {
          orgsdict[id].names.push(org.name[index]);
          orgsdict[id].count += 1;
        }
      });
    });
    setorganismsAvailable(orgsdict);
  }, [rnas]);

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
        <Grid item container xs={2} direction="column">
          <List>
            <Divider />
            <ListSubheader>Species</ListSubheader>
            <ListItem>
              <SpeciesList />
            </ListItem>

            <Divider />
            <ListItem>
              <SearchField />
            </ListItem>
            <ListItem>
              {/* <Pagination
                {...{ gotopage: prop.goto_page, pagecount: prop.pagestotal }}
              /> */}
            </ListItem>
          </List>
        </Grid>
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
              <Tab label="23S-like rRNA" {...a11yProps(0)} />
              <Tab label="16S-like rRNA" {...a11yProps(1)} />
              <Tab label="5S-like rRNA" {...a11yProps(2)} />
              <Tab label="mRNA" {...a11yProps(3)} />
              <Tab label="tRNA" {...a11yProps(4)} />
              <Tab label="uncategorized" {...a11yProps(5)} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container xs={12} spacing={2}>
                {class_23s.slice(0,20).map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            {/* <TabPanel value={tabValue} index={1}>
              <Grid container xs={12} spacing={2}>
                {class_16s.map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Grid container xs={12} spacing={2}>
                {class_5s.map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Grid container xs={12} spacing={2}>
                {mrnas.map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Grid container xs={12} spacing={2}>
                {trnas.map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <Grid container xs={12} spacing={2}>
                {other.map((r, i) => (
                  <Grid item xs={12}>
                    <RNACard e={r} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel> */}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RNACatalogue;
