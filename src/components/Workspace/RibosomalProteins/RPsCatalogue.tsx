import Grid from '@material-ui/core/Grid/Grid'
import React, {useCallback, useEffect, useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import SimpleBackdrop from "../Backdrop";
import {useTypedDispatch} from '../../../hooks/typedDispatch'
import { BanMetadataFilterChangeAC, requestBanMetadata } from '../../../redux/reducers/Proteins/ActionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import BanClassHero from './BanClassHero';
import {large_subunit_map} from '../../../static/large-subunit-map'
import {small_subunit_map} from '../../../static/small-subunit-map'
import { BanClass } from '../../../redux/RibosomeTypes';
import Button from '@material-ui/core/Button/Button';
import { useDebounce } from 'use-debounce';
import {debounce}from 'lodash'
import Cart from '../Cart/Cart';
import Typography from '@material-ui/core/Typography/Typography';
import { BanClassMetadata } from '../../../redux/DataInterfaces';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton/ToggleButton';
import Divider from '@material-ui/core/Divider/Divider';
import TextField from '@material-ui/core/TextField/TextField';
import PageAnnotation from '../Display/PageAnnotation';
import { ListSubheader } from '@material-ui/core';

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

    const e_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.e_SSU)
    const b_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.b_SSU)
    const u_SSU  = useSelector(( state:AppState ) => state.proteins.ban_classes_derived.u_SSU)


    


    //?----------------------------------------------------------------------------------------


    const [search, setSearch] = useState<string>("")
    // const [debounced]         = useDebounce(search,250)

    useEffect(() => {
        dispatch(BanMetadataFilterChangeAC(search, "SEARCH"))
    }, [search])

    const handleSearchChange = (e:any) =>{
        var change = e.target.value
        setSearch(change)
    }

  const [subunit, setSubunit] = React.useState<string | null>('LSU');

  useEffect(() => {
    console.log(subunit);
    

  }, [subunit])

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, subunit: string | null) => {
    setSubunit(subunit);
  };
  const MethodClasses =  makeStyles({
    root:{
        width:"100%",
    }
  })();

  var loading = useSelector(( state:AppState ) => state. proteins.is_loading)
    return (!loading) ? (
        <Grid xs={12} container item spacing={1} style={{ padding: "5px" }}>
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


        <PageAnnotation {
...{
  title:"Ribosomal Protein Classes",
  text:'Each protein nomenclature class is represented an ID card that contains individual protein strands found across different structures contained in the databse.'
}
}/>
                <Grid item xs={4} container direction={"column"}>

                    <List>

                        <ListSubheader> <b>Universal</b> Protein Classes</ListSubheader>
{(subunit === 'LSU' ? u_LSU : u_SSU).map(_ => {

                            return <ListItem>
                                <BanClassHero
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
