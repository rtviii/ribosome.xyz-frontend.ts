import Grid from '@material-ui/core/Grid/Grid'
import React, { useEffect, useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import SimpleBackdrop from "../Backdrop";
import { BanMetadataFilterChangeAC } from '../../../redux/reducers/Proteins/ActionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import BanClassHero from './BanClassHero';
import { BanClass } from '../../../redux/RibosomeTypes';
import Cart from '../Cart/Cart';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton/ToggleButton';
import Divider from '@material-ui/core/Divider/Divider';
import TextField from '@material-ui/core/TextField/TextField';
import PageAnnotation from '../Display/PageAnnotation';
import { ListSubheader } from '@material-ui/core';
import _ from 'lodash';

export interface BanPaperEntry {
    pfamDomainAccession  :  Array<string>;
    taxRange             :  Array<string>;
    b                    :  string | null;
    y                    :  string | null;
    h                    :  string | null;
}

const RPsCatalogue = () => {

    const dispatch    =  useDispatch()

    const e_LSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.e_LSU)
    const b_LSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.b_LSU)
    const u_LSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.u_LSU)

    const e_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.e_SSU.filter(r=>!r.banClass.includes("bTHX")))
    const b_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.b_SSU.filter(r=>!r.banClass.includes("RACK1")))
    const u_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.u_SSU.filter(r=>!( r.banClass.includes("RACK1") || r.banClass.includes("bTHX") ) ))

    const [search, setSearch] = useState<string>("")
    useEffect(() => {
        dispatch(BanMetadataFilterChangeAC(search, "SEARCH"))
    }, [search])
    const handleSearchChange = (e:any) =>{
        var change = e.target.value
        setSearch(change)
    }

  const [subunit, setSubunit] = React.useState<string | null>('LSU');

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, subunit: string | null) => {
    setSubunit(subunit);
  };
  const MethodClasses =  makeStyles({
    root:{
        width:"100%",
    }
  })();

  var loading = useSelector(( state:AppState ) => state. proteins.is_loading)

//   * ----------taxonomic filter -----

const [ data, setDropdownData ] = useState([
{ "label": "Bacteria"            , "value": [1977881 , 243230, 562, 224308, 574, 262724, 585, 474186, 575584, 1217649, 544404, 663, 1217710, 421052, 367830, 1772, 1773, 1280, 274, 1299, 287, 300852, 1351, 585035, 1144663, 1144670, 331111, 480119, 83333, 93061, 83334, 93062, 1931, 1223565, 52133, 1310637, 246196, 679895, 470, 1310678, 1960940], "checked": false ,  "children": [{"label": "Acinetobacter sp. ANC 4470", "value": [1977881], "checked": false}, {"label": "Deinococcus radiodurans R1", "value": [243230], "checked": false}, {"label": "Escherichia coli", "value": [562], "checked": false}, {"label": "Bacillus subtilis subsp. subtilis str. 168", "value": [224308], "checked": false}, {"label": "Klebsiella pneumoniae subsp. ozaenae", "value": [574], "checked": false}, {"label": "Thermus thermophilus HB27", "value": [262724], "checked": false}, {"label": "Proteus vulgaris", "value": [585], "checked": false}, {"label": "Enterococcus faecalis OG1RF", "value": [474186], "checked": false}, {"label": "Acinetobacter baumannii ATCC 19606 = CIP 70.34 = JCM 6841", "value": [575584], "checked": false}, {"label": "Acinetobacter beijerinckii ANC 3835", "value": [1217649], "checked": false}, {"label": "Escherichia coli O157:H7 str. TW14359", "value": [544404], "checked": false}, {"label": "Vibrio alginolyticus", "value": [663], "checked": false}, {"label": "Acinetobacter sp. NIPH 899", "value": [1217710], "checked": false}, {"label": "Acinetobacter rudis CIP 110305", "value": [421052], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus USA300", "value": [367830], "checked": false}, {"label": "Mycolicibacterium smegmatis", "value": [1772], "checked": false}, {"label": "Mycobacterium tuberculosis", "value": [1773], "checked": false}, {"label": "Staphylococcus aureus", "value": [1280], "checked": false}, {"label": "Thermus thermophilus", "value": [274], "checked": false}, {"label": "Deinococcus radiodurans", "value": [1299], "checked": false}, {"label": "Pseudomonas aeruginosa", "value": [287], "checked": false}, {"label": "Thermus thermophilus HB8", "value": [300852], "checked": false}, {"label": "Enterococcus faecalis", "value": [1351], "checked": false}, {"label": "Escherichia coli S88", "value": [585035], "checked": false}, {"label": "Acinetobacter sp. CIP 102082", "value": [1144663], "checked": false}, {"label": "Acinetobacter sp. CIP 51.11", "value": [1144670], "checked": false}, {"label": "Escherichia coli O139:H28 str. E24377A", "value": [331111], "checked": false}, {"label": "Acinetobacter baumannii AB0057", "value": [480119], "checked": false}, {"label": "Escherichia coli K-12", "value": [83333], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus NCTC 8325", "value": [93061], "checked": false}, {"label": "Escherichia coli O157:H7", "value": [83334], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus COL", "value": [93062], "checked": false}, {"label": "Streptomyces sp.", "value": [1931], "checked": false}, {"label": "Rhizobium sp. Pop5", "value": [1223565], "checked": false}, {"label": "Acinetobacter venetianus", "value": [52133], "checked": false}, {"label": "Acinetobacter sp. 809848", "value": [1310637], "checked": false}, {"label": "Mycolicibacterium smegmatis MC2 155", "value": [246196], "checked": false}, {"label": "Escherichia coli BW25113", "value": [679895], "checked": false}, {"label": "Acinetobacter baumannii", "value": [470], "checked": false}, {"label": "Acinetobacter sp. 263903-1", "value": [1310678], "checked": false}, {"label": "Acinetobacter sp. ANC 5600", "value": [1960940], "checked": false}].sort()},
{ "label": "Eukaryota"           , "value": [9739    , 5661, 5693, 5702, 5722, 9823, 1177187, 3702, 55431, 37000, 5811, 9913, 559292, 9986, 7460, 28985, 4932, 285006, 7536, 9606, 209285, 9615, 6039, 284590, 1247190, 759272, 36329, 3562],                                                                                                             "checked": false ,  "children": [{"label": "Tursiops truncatus", "value": [9739], "checked": false}, {"label": "Leishmania donovani", "value": [5661], "checked": false}, {"label": "Trypanosoma cruzi", "value": [5693], "checked": false}, {"label": "Trypanosoma brucei brucei", "value": [5702], "checked": false}, {"label": "Trichomonas vaginalis", "value": [5722], "checked": false}, {"label": "Sus scrofa", "value": [9823], "checked": false}, {"label": "Saccharomyces cerevisiae P283", "value": [1177187], "checked": false}, {"label": "Arabidopsis thaliana", "value": [3702], "checked": false}, {"label": "Palomena prasina", "value": [55431], "checked": false}, {"label": "Pyrrhocoris apterus", "value": [37000], "checked": false}, {"label": "Toxoplasma gondii", "value": [5811], "checked": false}, {"label": "Bos taurus", "value": [9913], "checked": false}, {"label": "Saccharomyces cerevisiae S288C", "value": [559292], "checked": false}, {"label": "Oryctolagus cuniculus", "value": [9986], "checked": false}, {"label": "Apis mellifera", "value": [7460], "checked": false}, {"label": "Kluyveromyces lactis", "value": [28985], "checked": false}, {"label": "Saccharomyces cerevisiae", "value": [4932], "checked": false}, {"label": "Saccharomyces cerevisiae RM11-1a", "value": [285006], "checked": false}, {"label": "Oncopeltus fasciatus", "value": [7536], "checked": false}, {"label": "Homo sapiens", "value": [9606], "checked": false}, {"label": "Chaetomium thermophilum", "value": [209285], "checked": false}, {"label": "Canis lupus familiaris", "value": [9615], "checked": false}, {"label": "Vairimorpha necatrix", "value": [6039], "checked": false}, {"label": "Kluyveromyces lactis NRRL Y-1140", "value": [284590], "checked": false}, {"label": "Saccharomyces cerevisiae BY4741", "value": [1247190], "checked": false}, {"label": "Chaetomium thermophilum var. thermophilum DSM 1495", "value": [759272], "checked": false}, {"label": "Plasmodium falciparum 3D7", "value": [36329], "checked": false}, {"label": "Spinacia oleracea", "value": [3562], "checked": false}].sort()},
{ "label": "Archaea"             , "value": [311400  , 273057, 1293037, 2287, 69014, 272844],                                                                                                                                                                                                                                                             "checked": false ,  "children": [{"label": "Thermococcus kodakarensis", "value": [311400], "checked": false}, {"label": "Saccharolobus solfataricus P2", "value": [273057], "checked": false}, {"label": "Thermococcus celer Vu 13 = JCM 8558", "value": [1293037], "checked": false}, {"label": "Saccharolobus solfataricus", "value": [2287], "checked": false}, {"label": "Thermococcus kodakarensis KOD1", "value": [69014], "checked": false}, {"label": "Pyrococcus abyssi GE5", "value": [272844], "checked": false}].sort()},
{ "label": "Viruses"             , "value": [194966  , 10665],                                                                                                                                                                                                                                                                                            "checked": false ,  "children":
[{"label": "Salmonella virus SP6", "value": [194966 ],                                                                                                                                                                                                                                                                                                    "checked": false}, {"label"   : "Escherichia virus T4", "value": [10665], "checked": false}].sort()}
]
)
// @ts-ignore
const onChange = (currentNode, selectedNodes) => {
for (var parent of data){
  if (_.isEmpty(_.xor(parent.value, currentNode.value))){
   var     updatedIn             = parent.children.map(child => { return {...child, checked:currentNode.checkedk} })
   var     parentIndex           = data.findIndex(d=> d.label === parent.label)
   var     newdata               = data;
   newdata[parentIndex].checked  = currentNode.checked
   newdata[parentIndex].children = updatedIn

    setDropdownData(newdata)
  }
  else if( parent.value.includes( currentNode.value[0] ) ) 
  {
  var         childindex            = parent.children.findIndex(x => currentNode.label === x.label)
  var         newChildren           = [...parent.children ]
  newChildren[childindex].checked   = currentNode.checked
  var         parentIndex           = data.findIndex(d=> d.label === parent.label)
  var         newdata               = data;
  newdata    [parentIndex].children = newChildren
  setDropdownData(newdata)

  }
}

  if ( currentNode.checked ){
    setSelectedSpecies([...selectedSpecies, ...currentNode.value])
  }else{
    setSelectedSpecies(selectedSpecies.filter(( r:any )=> !currentNode.value.includes(r)))
  }

}

const [selectedSpecies, setSelectedSpecies] = useState<any>([])
useEffect(() => {
  dispatch(BanMetadataFilterChangeAC(selectedSpecies,"SPECIES"))
}, [selectedSpecies])

//   * ----------species filter -----


    return (!loading) ? (
        <Grid xs={12} container item spacing={1} style={{ padding: "5px" }}>
            <Grid item xs={12}>
        <PageAnnotation {
...{
  title:"Ribosomal Protein Classes",
  text:'Each protein nomenclature class is represented an ID card that contains individual protein strands found across different structures contained in the databse.'
    }}/>
            </Grid>
            <Grid item xs={2}>
                <List>
                    <ListItem key={"rps-searchfield"} >

                        <TextField id="standard-basic" label="Search" value={search} onChange={handleSearchChange} />

                    </ListItem>

                    <ListItem key={"method-toggle"} >
                        <ToggleButtonGroup
                            value={subunit}
                            exclusive
                            onChange={handleAlignment}
                            aria-label="text alignment"
                            className={MethodClasses.root}>
                            <ToggleButton
                                className={MethodClasses.root}
                                value="LSU" aria-label="left aligned">
                                LSU
                            </ToggleButton>
                            <ToggleButton
                                className={MethodClasses.root}
                                value="SSU" aria-label="right aligned" >
                                SSU
                        </ToggleButton>
                        </ToggleButtonGroup>
                    </ListItem>

                    <ListItem  >
                        <Divider />
                    </ListItem>



                    <ListItem >
                        <Cart />
                    </ListItem>
                    <ListItem >
                        <DashboardButton />
                    </ListItem>
                </List>
            </Grid>
            <Grid xs={10} container item  >


                <Grid item xs={4} container direction={"column"}>

                    <List>

                        <ListSubheader> <b>Universal</b> Protein Classes</ListSubheader>
{(subunit === 'LSU' ? u_LSU : u_SSU).map(_ => {

                            return <ListItem>
                                <BanClassHero
                                structures={_.structs}
                                    comments={_.comments}
                                    unique_organisms={_.organisms}
                                    nom_class={_.banClass as BanClass}
                                />
                            </ListItem>
                        })}
                    </List>
                </Grid>
                <Grid item xs={4} container direction={"column"}>
                    <List>
<ListSubheader> <b>Eukaryotic</b> Protein Classes</ListSubheader>
                        
                        {(subunit === 'LSU' ? e_LSU : e_SSU).map(_ => {

                            return <ListItem>
                                <BanClassHero
                                structures={_.structs}
                                    comments={_.comments}
                                    unique_organisms={_.organisms}
                                    nom_class={_.banClass as BanClass}
                                />
                            </ListItem>
                        })}
                    </List>
                </Grid>
                <Grid item xs={4} container direction={"column"}>

                    <List>
                        <ListSubheader> <b>Bacterial</b> Protein Classes</ListSubheader>
                    {(subunit === 'LSU' ? b_LSU : b_SSU).map(_ => {

                        return <ListItem>
                            <BanClassHero
                                structures={_.structs}
                                comments={_.comments}
                                unique_organisms={_.organisms}
                                nom_class={_.banClass as BanClass}
                            />
                        </ListItem>
                    })}

                    </List>
                </Grid>



            </Grid>
        </Grid>
    ) :
        <SimpleBackdrop />
}





export default RPsCatalogue
