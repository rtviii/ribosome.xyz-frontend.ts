import React from                        'react'                                        ;
import { useDispatch, useSelector } from 'react-redux'
import clsx from                         'clsx'                                         ;
import { makeStyles } from               '@material-ui/core/styles'                     ;
import Drawer from                       '@material-ui/core/Drawer'                     ;
import List from                         '@material-ui/core/List'                       ;
import Divider from                      '@material-ui/core/Divider'                    ;
import ListItem from                     '@material-ui/core/ListItem'                   ;
import ListItemIcon from                 '@material-ui/core/ListItemIcon'               ;
import                                   './Dashboard.css'
import ListItemText from                 '@material-ui/core/ListItemText'               ;
import { ListSubheader } from            '@material-ui/core'                            ;
import { useHistory } from               'react-router-dom'                             ;
import enzymes from                      './../../static/enzymes-icon.png'
import rnas from                         './../../static/rna_icon.svg'
import CloseIcon from                    '@material-ui/icons/Close'                    ;
import bookmark from                     './../../static/bookmark_icon.svg'
import proteins from                     './../../static/protein_icon.svg'
import ligands from                      './../../static/ligand_icon.svg'
import table from                      './../../static/table.png'
import home from                         './../../static/mainpage_icon.svg'
import align from                        './../../static/align_icon.svg'
import eye from                          './../../static/eye_icon.svg'
import { toggle_dashboard } from         './../../redux/reducers/Interface/ActionTypes'
import { AppState } from                 '../../redux/store'                            ;
import { ThunkDispatch } from            'redux-thunk'                                  ;
import { AppActions } from               '../../redux/AppActions'                       ;
import { connect } from                  'react-redux'                                  ;
import SettingsIcon from                 '@material-ui/icons/Settings'                  ;
import Paper from                        '@material-ui/core/Paper/Paper'                ;
import { Cart, Item } from               '../../components/Workspace/Cart/Cart'        ;
import Button from                       '@material-ui/core/Button/Button'             ;
import { toggle_cart } from              '../../redux/reducers/Cart/ActionTypes'       ;
import Dialog from                       '@material-ui/core/Dialog/Dialog'             ;
import IconButton from                   '@material-ui/core/IconButton/IconButton'     ;
import Toolbar from                      '@material-ui/core/Toolbar/Toolbar'           ;
import AppBar from                       '@material-ui/core/AppBar/AppBar'             ;
import { isProt, isRNA, isStruct } from  '../../redux/reducers/Cart/CartReducer'       ;
import { CSVLink } from                  'react-csv'                                   ;
import _ from                            'lodash'                                      ;
import { download_zip } from             '../../redux/AsyncActions/getNeo4jData'       ;

const useStyles = makeStyles({
  root:{
    zIndex:200
  },
  list: {
    width: 300,
  },
  fullList: {
    width: 300,
  },
});

type Anchor = 'left' ;

type MenuItemData = {
  key     : string
  iconsrc?: string
  linkto  : string
  menutext: string
}

interface DashState{dashboard_hidden:boolean};
interface ToggleDash{toggle_dash:()=>void};
type DashProps = DashState & ToggleDash;


const ms = (state:AppState, ownProps:any): DashState  =>({
   dashboard_hidden: state.Interface.dashboardHidden
})
const md = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: any
):ToggleDash  => ({
  toggle_dash: () =>dispatch(toggle_dashboard())
});

const _MenuItem:React.FC<{
  icon:string
  toggle_dash: ()=>void;
  tooltip    : boolean;
 
  } & MenuItemData> = (props)=>{
  const history = useHistory();

  return (
    <ListItem button key={props.key}  onClick={()=>{
      props.toggle_dash()
      history.push(props.linkto)}
      }>

      <ListItemIcon>
        {<img src={props.icon} style={{ height: "30px", width: "30px" }} />}
      </ListItemIcon>

        <ListItemText primary={props.menutext} />

    </ListItem>
    
    )}

const _DashboardButton: React.FC<DashProps> = (props) => {
  return         <Paper variant="elevation" elevation={3} 

onClick = {() => props.toggle_dash()}
id      = "dashboard-icon"
style   = {{
    // outline     : "1px solid rgba(203,250,255,0.6)",
    marginTop   : "35px",
    marginBottom: "30px",
    cursor      : "pointer",
    padding     : "15px",
    }} >



  <SettingsIcon 
          style   = {{
        width : "70px",
        height: "70px",
      }} />

{/* <Typography style={{fontSize:"40px"}}> Tools</Typography> */}


  </Paper>
}

const _TemporaryDrawer: React.FC<DashProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();


  const handleClose = () => {
      dispatch(toggle_cart())
  };

    const open     = useSelector(( state:AppState ) => state.cart.open)

    const cart_classes = ( makeStyles((theme) => ({
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
    })) )();

    const selectedItems = useSelector(( state:AppState ) => state.cart.selectedItems)

    const cartitems = useSelector(( state:AppState ) => state.cart.items)

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

            summary.push([ 'riboxyz_workspace_structure',it.rcsb_id, it.citation_title, it.expMethod,`${ it.resolution }Å`,it.citation_year, it._organismId,it.pdbx_keywords_text  ])
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


  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {[classes.fullList]: anchor === 'left' || anchor === 'top',})}
      role="presentation">
      <MenuItem key='new'  icon={home} menutext="Home" linkto='/home'/>
      
    <ListItem button key={"wspace-dash"}  onClick={()=>{
      dispatch(toggle_cart())

      // props.toggle_dash()
    }
      }>






      <ListItemIcon>
        {<img src={bookmark} style={{ height: "30px", width: "30px" }} />}
      </ListItemIcon>

        <ListItemText primary={"Workspace"} />

    </ListItem>


            <Dialog fullScreen open={open} onClose={handleClose}>
                <AppBar className={cart_classes.appBar} color="default">
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


      <Divider />

      <List>

        <ListSubheader>Available Data</ListSubheader>

        <MenuItem key='new' icon={enzymes } menutext="Structures" linkto='/structs' />
        <MenuItem key='new' icon={proteins} menutext="Proteins"   linkto='/rps'     />
        <MenuItem key='new' icon={rnas    } menutext="RNA"        linkto='/rnas'    />
        <MenuItem key='new' icon={table    } menutext="Nomenclature"        linkto='/nomenclature'    />
        {/* <MenuItem key='new'  icon={enzymes} menutext="Ligands"    linkto='/ligands' /> */}

      </List>
      <Divider />
      <List>

        <ListSubheader>Tools</ListSubheader>
        <MenuItem key = 'new1' icon = {eye    } menutext = "Visualization" linkto = '/vis'          />
        <MenuItem key = 'new1' icon = {align  } menutext = "Alignment"     linkto = '/rpalign'      />
        <MenuItem key = 'new1' icon = {ligands} menutext = "Binding Sites" linkto = '/bindingsites' />
      </List>
    </div>
  );

 return( 
      <React.Fragment key={"left"}>
        <Drawer
          anchor={"left"}
          open={props.dashboard_hidden}
          onClose={()=>props.toggle_dash()}>
          {list("left")}
        </Drawer>
      </React.Fragment>
)
}

const  MenuItem              = connect(null, md)(_MenuItem)
export const DashboardButton = connect(ms,md)(_DashboardButton)
export const TemporaryDrawer = connect(ms,md)(_TemporaryDrawer)