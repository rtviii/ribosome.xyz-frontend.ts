import VisibilityIcon from                                             '@material-ui/icons/Visibility'               ;
import                                                                 './Cart.css'
import React, { useEffect } from                                                      'react'
import { useDispatch, useSelector } from                               'react-redux'
import { RNAProfile } from                                             '../../../redux/DataInterfaces'
import { AppState } from                                               '../../../redux/store'
import { makeStyles } from                                             '@material-ui/core/styles'                    ;
import List from                                                       '@material-ui/core/List'                      ;
import ListItem from                                                   '@material-ui/core/ListItem'                  ;
import ListItemIcon from                                               '@material-ui/core/ListItemIcon'              ;
import ListItemSecondaryAction from                                    '@material-ui/core/ListItemSecondaryAction'   ;
import ListItemText from                                               '@material-ui/core/ListItemText'              ;
import IconButton from                                                 '@material-ui/core/IconButton'                ;
import Button from                                                     '@material-ui/core/Button'                    ;
import Dialog from                                                     '@material-ui/core/Dialog'                    ;
import AppBar from                                                     '@material-ui/core/AppBar'                    ;
import Toolbar from                                                    '@material-ui/core/Toolbar'                   ;
import Typography from                                                 '@material-ui/core/Typography'                ;
import CloseIcon from                                                  '@material-ui/icons/Close'                    ;
import { Protein, RibosomeStructure } from                    '../../../redux/RibosomeTypes'
import DeleteIcon from                                                 '@material-ui/icons/Delete'                   ;
import { cart_remove_item, toggle_cart, toggle_cart_item_select } from '../../../redux/reducers/Cart/ActionTypes'
import {CartItem} from                                                 './../../../redux/reducers/Cart/ActionTypes'
import enzymes from                                                    './../../../static/struct_icon.svg'
import rnas from                                                       './../../../static/rna_icon.svg'
import proteins from                                                   './../../../static/protein_icon_chain.svg'
import Checkbox from                                                   '@material-ui/core/Checkbox'                  ;
import { ChainParentPill} from                                         './../RibosomalProteins/RibosomalProteinCard'
import Grid from                                                       '@material-ui/core/Grid/Grid'
import { isProt , isStruct, isRNA } from                               '../../../redux/reducers/Cart/CartReducer'
import _ from                                                          'lodash'
import { generatePath , useHistory } from                              'react-router'                                ;
import { download_zip } from                                           '../../../redux/AsyncActions/getNeo4jData'    ;
import { CSVDownload , CSVLink } from                                  'react-csv'                                   ;

export const Cart= () => {
    const cartitems = useSelector(( state:AppState ) => state.cart.items)
    const selectedItems = useSelector(( state:AppState ) => state.cart.selectedItems)
    const useCartStyles = makeStyles((theme) => ({
        root: {
            zIndex         : -200,
            width          : '100%',
            maxWidth       : 360,
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
  const handleClickOpen       = () => {
      dispatch(toggle_cart())
  };

  const handleClose = () => {
      dispatch(toggle_cart())
  };


   const generate_selected_archive =()=>{
      var selected_items:{[K in 'structs' | 'rna' | 'rps']:string[]} = {
          "rps"    : [],
          "rna"    : [],
          "structs": []
      }
      for (var it of selectedItems){
          if (isProt(it)){
            selected_items.rps.push(`${it.parent_rcsb_id.toLowerCase()}.${it.entity_poly_strand_id}`)
          }
          if (isRNA(it)){
            selected_items.rna.push(`${it.struct.toLowerCase()}.${it.strand}`)
          }
          if (isStruct(it)){
            selected_items.structs.push(`${it.rcsb_id.toLowerCase()}`)
          }
      }
      

      download_zip(selected_items, 'workspace.zip')
      
  }

  const generate_wspace_summary = () =>{
     
  var summary:Array<Array<any>> = [
  ]

      for( var it of selectedItems) {
        if(isStruct(it)){

            summary.push([ 'riboxyz_workspace_structure',it.rcsb_id, it.citation_title, it.expMethod,`${ it.resolution }Å`,it.citation_year, 
            it.src_organism_ids[0]
            // it._organismId
            ,it.pdbx_keywords_text  ])
        }
        if(isRNA(it)){
            summary.push(['riboxyz_workspace_rna', it.description,it.struct + "_" + it.strand,it.parent_method, it.parent_resolution+"Å", it.parent_citation,it.parent_year,it.seq])
        }
        if(isProt(it)){
            summary.push(['riboxyz_workspace_protein', it.parent_rcsb_id +"_" + it.entity_poly_strand_id, it.nomenclature,it.pfam_descriptions, it.pfam_descriptions,it.uniprot_accession, it.entity_poly_seq_one_letter_code])
        }
      }

      return  summary
  }
    return (
        <div style={{
            

            height:"100%", width:"100%"}}>
            <Button
            id="cart-button"
            variant="outlined"
            color="primary"
            
        onClick={handleClickOpen} 
        style={{
            outline:"1px solid rgba(83,83,83,0.1)",
            height:"100%", textTransform: "none", cursor: "pointer", width: "100%", fontWeight: 500, color: "black"
                }}
            >

                Workspace

            ({cartitems.length} items)


            </Button>


            <Dialog fullScreen open={open} onClose={handleClose}>

                <AppBar className={classes.appBar} color="default">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Button variant="text" color="default" disabled={true} style={{textTransform:"none", marginLeft:"10px"}}>
                            {selectedItems.length} items selected
                        </Button>
                        <Button autoFocus  variant="outlined" color="primary" onClick={
                            () => {
                                if (selectedItems.length > 1) {
                                    generate_selected_archive()
                                } else { alert("Select items to download.") }
                            }
                        }

                            style={{marginRight:"10px", textTransform:"none", textDecoration:"none", color:"black"}}
                        >
                            Download Archive

                    </Button>


                            <Button autoFocus variant="outlined" color="primary">

{selectedItems.length > 0 ?

                        <CSVLink data={generate_wspace_summary()} style={{textTransform:"none", textDecoration:"none", color:"blac"}}>
                                Download Summary
                        </CSVLink>:
                        "Download Summary"
}
                            </Button>
                    </Toolbar>
                </AppBar>

                <List dense={false}  >
                    {cartitems.map((item, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        return (
                            <Item i={item} selected={_.includes(selectedItems,item)} />
                            )
                    })}


                </List>

            </Dialog>
</div>
            
    )
}





export const Item = ({i,selected}:{ i:CartItem, selected:boolean })=>{
    if (isProt(i)){
        return <ProtItem i={i} selected={selected}/>

    }
    if (isStruct(i)){

        return <StructItem i={i} selected={selected}/>
    }
    if (isRNA(i)){

        return <RNAItem i={i} selected={selected}/>
    }

    else {
        return <></>
    }

}
const ProtItem = ({selected,i}:{ selected:boolean,i:Protein })=>{

    const history = useHistory();
    const dispatch = useDispatch();
    return     <ListItem key={i.parent_rcsb_id + i} role={undefined}  button dense style={{backgroundColor:"rgba(225,231,254,0.6)", marginBottom:"5px"}}>

<Checkbox
onClick={()=>{
    dispatch(toggle_cart_item_select(i,!selected))

}}
checked={selected}
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
                                <ListItemIcon>
                                        <img src={proteins}  style={{width:'30px', height:'30px'}}/>
                                </ListItemIcon>
                                <ListItemText id={""} primary={`${i.nomenclature[0]}`}
                                
                                secondary={i.rcsb_pdbx_description}/>


                            <Grid container xs={12}>

<Grid item>

                           <ChainParentPill parent_id={i.parent_rcsb_id} strand_id={i.entity_poly_strand_id}/> 
</Grid>
                            </Grid>


<VisibilityIcon

onClick={()=>{

    dispatch(toggle_cart())
history.push({pathname:`/vis`, state:{banClass:i.nomenclature[0], parent:i.parent_rcsb_id} })
}}
/>

                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments" onClick={
                                        () =>{dispatch(cart_remove_item(i))}
                                    }>
                                        <DeleteIcon />
                                        
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            
    
}
const StructItem = ({selected,i}:{ selected:boolean,i:RibosomeStructure })=>{

    const history = useHistory();
    const dispatch = useDispatch();
    return     <ListItem key={i.rcsb_id + i} role={undefined}
    
    dense button style={{backgroundColor:"rgba(254,246,225,0.6)", marginBottom:"5px"}}>
<Checkbox
onClick={()=>{
    dispatch(toggle_cart_item_select(i,!selected))

}}
checked={selected}
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />

                                <ListItemIcon>
                                        <img src={enzymes}  style={{width:'30px', height:'30px'}}/>
                                </ListItemIcon>
                                <ListItemText id={""} primary={`Structure ${i.rcsb_id}`}
                                
                                secondary={i.citation_title}/>


<VisibilityIcon

onClick={()=>{
    dispatch(toggle_cart())
history.push({ pathname: `/vis`, state: { struct: i.rcsb_id } }) 

}}
/>

                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments" onClick={
                                        () =>{dispatch(cart_remove_item(i))}
                                    }>
                                        <DeleteIcon />
                                        
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
}
const RNAItem = ({selected,i}:{ selected:boolean,i:RNAProfile })=>{

    useEffect(() => {
    console.log("GOT RNA item", i);

    }, [])
    

const dispatch = useDispatch();

return     <ListItem key={i.description + i} role={undefined}  dense button style={{backgroundColor:"rgba(172,191,169,0.6)", marginBottom:"5px"}}>

        <Checkbox
        checked={selected}

onClick={()=>{
    dispatch(toggle_cart_item_select(i,!selected))

}}
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />

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
