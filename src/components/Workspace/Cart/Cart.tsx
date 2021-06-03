import Paper from '@material-ui/core/Paper/Paper'
import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NeoHomolog, RNAProfile } from '../../../redux/DataInterfaces'
import { AppState } from '../../../redux/store'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData'
import ContentSelectAll from 'material-ui/svg-icons/content/select-all'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { ListSubheader } from '@material-ui/core'
import { RibosomalProtein, RibosomeStructure } from '../../../redux/RibosomeTypes'
import DeleteIcon from '@material-ui/icons/Delete';
import { cart_remove_item, toggle_cart } from '../../../redux/reducers/Cart/ActionTypes'
import {CartItem} from './../../../redux/reducers/Cart/ActionTypes'
import enzymes from './../../../static/enzymes-icon.png'
import rnas from './../../../static/rna_icon.svg'
import proteins from './../../../static/protein_icon.svg'

import {ChainParentPill} from './../RibosomalProteins/RibosomalProteinCard'
import Grid from '@material-ui/core/Grid/Grid'
import { isProt, isStruct, isRNA } from '../../../redux/reducers/Cart/CartReducer'

export const Cart= () => {
    const cartitems = useSelector(( state:AppState ) => state.cart.items)
    const useCartStyles = makeStyles((theme) => ({
        root: {
            zIndex:-200,
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    appBar: {
        width:"100%",
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    }));
    const classes  = useCartStyles()
    const open     = useSelector(( state:AppState ) => state.cart.open)
    const dispatch = useDispatch();


  const [checked, setChecked] = React.useState([0]);
  const handleClickOpen = () => {
      dispatch(toggle_cart())
  };

  const handleClose = () => {
      dispatch(toggle_cart())
  };

    return (
<>
            <Button
            variant="outlined"
            color="primary"
            
        onClick={handleClickOpen} 
        style={{
 textTransform:"none",                        cursor:"pointer", width:"100%", fontWeight:500, color:"black" }}
            >

             Workspace

            (<i>{cartitems.length}</i>)

            </Button>

            <Dialog fullScreen open={open} onClose={handleClose}>

                <AppBar className={classes.appBar} color="default">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography  style={{textTransform:"none"}} variant="h6" className={classes.title}>
                            Workspace
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => {
                        }}>
                            Download
                    </Button>
                    </Toolbar>
                </AppBar>

                <List dense={false}  >

                    {cartitems.map((item, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        return (
                            
                            <Item {...item} />
                            )
                    })}


                </List>

            </Dialog>

</>
            
    )
}





const Item = (i:CartItem)=>{
    if (isProt(i)){
        return <ProtItem {...i} />

    }
    if (isStruct(i)){

        return <StructItem {...i} />
    }
    if (isRNA(i)){

        return <RNAItem {...i} />
    }

    else {
        return <></>
    }

}

const ProtItem = (i:RibosomalProtein)=>{

    const dispatch = useDispatch();
    return     <ListItem key={i.parent_rcsb_id + i} role={undefined}  button dense style={{backgroundColor:"rgba(225,231,254,0.6)", marginBottom:"5px"}}>
                                <ListItemIcon>
                                        <img src={proteins}  style={{width:'30px', height:'30px'}}/>
                                </ListItemIcon>
                                <ListItemText id={""} primary={`Protein Strand ${i.nomenclature[0]}`}
                                
                                secondary={i.rcsb_pdbx_description}/>


                            <Grid container xs={12}>

<Grid item>

                           <ChainParentPill parent_id={i.parent_rcsb_id} strand_id={i.entity_poly_strand_id}/> 
</Grid>
                            </Grid>


                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments" onClick={
                                        () =>{dispatch(cart_remove_item(i))}
                                    }>
                                        <DeleteIcon />
                                        
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            
    
}

const StructItem = (i:RibosomeStructure)=>{

    const dispatch = useDispatch();
    return     <ListItem key={i.rcsb_id + i} role={undefined} dense button style={{backgroundColor:"rgba(254,246,225,0.6)", marginBottom:"5px"}}>
                                <ListItemIcon>
                                        <img src={enzymes}  style={{width:'30px', height:'30px'}}/>
                                </ListItemIcon>
                                <ListItemText id={""} primary={`Structure ${i.rcsb_id}`}
                                
                                secondary={i.citation_title}/>
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments" onClick={
                                        () =>{dispatch(cart_remove_item(i))}
                                    }>
                                        <DeleteIcon />
                                        
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
}
const RNAItem = (i:RNAProfile)=>{

const dispatch = useDispatch();
return     <ListItem key={i.description + i} role={undefined}  dense button style={{backgroundColor:"rgba(172,191,169,0.6)", marginBottom:"5px"}}>


                            <ListItemIcon>
                                        <img src={rnas}  style={{width:'30px', height:'30px'}}/>
                            </ListItemIcon>
                            <ListItemText 
                            
                            id={""} primary={<Typography>RNA Strand  </Typography>}
                            
                            secondary={i.description}/>
                            <Grid container xs={12}>

<Grid item>

                           <ChainParentPill parent_id={i.struct} strand_id={i.strand}/> 
</Grid>
                            </Grid>
                           
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="comments" onClick={
                                    () =>{dispatch(cart_remove_item(i))}
                                }>
                                    <DeleteIcon />
                                    
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
}
