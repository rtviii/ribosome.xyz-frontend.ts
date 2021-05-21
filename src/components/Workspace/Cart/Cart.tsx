import Paper from '@material-ui/core/Paper/Paper'
import React from 'react'
import { connect } from 'react-redux'
import { NeoHomolog } from '../../../redux/DataInterfaces'
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
import { RibosomalProtein } from '../../../redux/RibosomeTypes'

interface StateProps{
    cartitems:RibosomalProtein[]
}

const Cart:React.FC<StateProps> = (prop) => {
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
    const classes = useCartStyles()
  const [checked, setChecked] = React.useState([0]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("closing?");
    
  };

    return (


<>
            <Button
            variant="outlined"
            color="primary"
            
        onClick={handleClickOpen} 
        style={{
            // zIndex:-100,
                         cursor:"pointer", width:"100%", fontWeight:500, color:"black" }}
            >

             Workspace

            {prop.cartitems.map(i => 
                <ListItem>
                {i.entity_poly_strand_id + " [" +i.nomenclature[0]+"]" }
                </ListItem>
            )}

            </Button>

            <Dialog fullScreen open={open} onClose={handleClose}>

                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Workspace
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => {



                            getNeo4jData("static_files", {
                                endpoint: "downloadArchive", params:
                                    prop.cartitems.reduce((acc: { [k: string]: string }, val: RibosomalProtein) => {

                                        if (Object.keys(acc).includes(val.parent_rcsb_id)) {
                                            acc[val.parent_rcsb_id] = acc[val.parent_rcsb_id] + '.' + val.entity_poly_strand_id
                                        }
                                        else {
                                            acc[val.parent_rcsb_id] = val.entity_poly_strand_id
                                        } return acc
                                    }, {})

                            }).then(r => { fileDownload(r.data, 'chains.zip'); },
                                e => { console.log(e); })
                        }}>
                            Download
                    </Button>
                    </Toolbar>
                </AppBar>

                <List>
                    {prop.cartitems.map((prot, i) => {
                        const labelId = `checkbox-list-label-${prot}`;
                        return (
                            <ListItem key={prot.parent_rcsb_id + i} role={undefined} dense button >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={true}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`Protein ${prot.nomenclature[0]} (${prot.parent_rcsb_id})`} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments">
                                        <CommentIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>)
                    })}

                </List>

            </Dialog>

</>

            
    )

}



const mapstate = (as: AppState, ownProps: any): StateProps => ({
    cartitems: as.cart.proteins
})

export default connect(mapstate, null)(Cart)
function useStyles() {
    throw new Error('Function not implemented.')
}

