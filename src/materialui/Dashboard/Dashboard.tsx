import   React           , { useEffect } from 'react'                                       ;
import   clsx                            from 'clsx'                                        ;
import { makeStyles       }              from '@material-ui/core/styles'                    ;
import   Drawer                          from '@material-ui/core/Drawer'                    ;
import   List                            from '@material-ui/core/List'                      ;
import   Divider                         from '@material-ui/core/Divider'                   ;
import   ListItem                        from '@material-ui/core/ListItem'                  ;
import   ListItemIcon                    from '@material-ui/core/ListItemIcon'              ;
import './Dashboard.css'
import   ListItemText                    from '@material-ui/core/ListItemText'              ;
import { ListSubheader   , Tooltip }     from '@material-ui/core'                           ;
import { useHistory       }              from 'react-router-dom'                            ;
import   gear                            from './../../static/gear.png'
import   enzymes                         from './../../static/enzymes-icon.png'
import   rnas                            from './../../static/rna_icon.svg'
import   proteins                        from './../../static/protein_icon.svg'
import   ligands                         from './../../static/ligand_icon.svg'
import   home                            from './../../static/mainpage_icon.svg'
import   align                           from './../../static/align_icon.svg'
import   eye                             from './../../static/eye_icon.svg'
import { toggle_dashboard }              from './../../redux/reducers/Interface/ActionTypes'
import { AppState         }              from '../../redux/store'                           ;
import { ThunkDispatch    }              from 'redux-thunk'                                 ;
import { AppActions       }              from '../../redux/AppActions'                      ;
import { connect         , useDispatch } from 'react-redux'                                 ;
import   Grid                            from '@material-ui/core/Grid'                      ;
import   bookmark                        from './../../static/bookmark_icon.svg'
import SettingsIcon from '@material-ui/icons/Settings';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import { Cart } from '../../components/Workspace/Cart/Cart';

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
  tooltip    : boolean
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

  const classes = useStyles();
  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {[classes.fullList]: anchor === 'left' || anchor === 'top',})}
      role="presentation">
      <MenuItem key='new'  icon={home} menutext="Home" linkto='/home'/>

      <Divider />

      <List>

        <ListSubheader>Available Data</ListSubheader>

        <MenuItem key='new' icon={enzymes } menutext="Structures" linkto='/structs' />
        <MenuItem key='new' icon={proteins} menutext="Proteins"   linkto='/rps'     />
        <MenuItem key='new' icon={rnas    } menutext="RNA"        linkto='/rnas'    />
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