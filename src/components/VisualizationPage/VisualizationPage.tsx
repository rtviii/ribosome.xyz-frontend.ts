import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { AppState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { BanClassMetadata } from '../Workspace/RibosomalProteins/BanClassHero';
import { RNAProfile } from '../../redux/DataInterfaces';
const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);


interface StructSnip {
    rcsb_id: string,
    title  : string,
    any?   : any}

type VisItem  =  StructSnip | BanClassMetadata | RNAProfile

const SelectStruct = ({items, selectItem}:{items:StructSnip[], selectItem:(_:string)=>void}) => {
const styles= useSelectStyles();
  const [curVal, setVal] = React.useState('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      let item = event.target.value as string
    setVal(item);
    selectItem(item)
  };
    return (
        <FormControl className={styles.formControl}>
        <InputLabel id="demo-simple-select-label">Structures</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={curVal}
            onChange={handleChange}
        >
        {items.map(( i )  =>
            <MenuItem value={ i.rcsb_id}>{i.rcsb_id}</MenuItem>
        )}
        </Select>
        </FormControl>
    )
}

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;

const VisualizationPage = () => {

  useEffect(() => {
      var options = {
        moleculeId: '3j9m',
        hideControls: true
      }
      var viewerContainer = document.getElementById('molstar-viewer');
      viewerInstance.render(viewerContainer, options);
  }, [])

  const proteins   = useSelector(( state:AppState ) => state.proteins.ban_classes)
  const structures = useSelector(( state:AppState ) => state.structures.neo_response.map(
      r=>{return { rcsb_id: r.struct.rcsb_id, title: r.struct.citation_title } }))
  const rnas       = useSelector(( state:AppState ) => state.rna.all_rna)
  const selectStruct = (rcsb_id:string) =>{
      console.log("select fired", rcsb_id.toLocaleLowerCase());
      
            viewerInstance.visual.update({
                moleculeId:rcsb_id.toLowerCase()
            });
  }


    return (
        <Grid>

<SelectStruct  items={structures} selectItem={selectStruct}/>

      <div id="molstar-viewer">Molstar Viewer</div>
        {/* <Button variant="outlined"
          onClick={() => {
            viewerInstance.visual.update({
                moleculeId:'2nnu'
            });
          }}> */}
              {/* Vis */}

        {/* </Button> */}


        </Grid>
    )
}

export default VisualizationPage
