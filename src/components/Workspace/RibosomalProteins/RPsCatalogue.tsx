import Grid from '@material-ui/core/Grid/Grid'
import React, {useCallback, useEffect, useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import SimpleBackdrop from "../Backdrop";
import {useTypedDispatch} from '../../../hooks/typedDispatch'
import { requestBanMetadata } from '../../../redux/reducers/Proteins/ActionTypes';
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

export interface BanPaperEntry {

    pfamDomainAccession  :  Array<string>;
    taxRange             :  Array<string>;
    b                    :  string | null;
    y                    :  string | null;
    h                    :  string | null;

}
const RPsCatalogue = () => {

    const dispatch    =  useDispatch()
    const banClasses  =  useSelector(( state:AppState ) => state.proteins.ban_classes_derived)

    useEffect(() => {dispatch(requestBanMetadata());}, [])




    const e_LSU  = banClasses.filter(  x=>x.banClass.toLowerCase().includes("e")  && !x.banClass.includes("S"))
    const b_LSU  = banClasses.filter(  x=>x.banClass.toLowerCase().includes("b")  && !x.banClass.includes("S"))
    const u_LSU  = banClasses.filter(  x=>x.banClass.toLowerCase().includes("u")  && !x.banClass.includes("S"))

    const e_SSU  = banClasses.filter(x=>x.banClass.toLowerCase().includes("e")  && !x.banClass.includes("L"))
    const b_SSU  = banClasses.filter(x=>x.banClass.toLowerCase().includes("b")  && !x.banClass.includes("L"))
    const u_SSU  = banClasses.filter(x=>x.banClass.toLowerCase().includes("u")  && !x.banClass.includes("L"))

    const Other  =  banClasses.filter(x=>["RACK1", "bTHX"].includes(x.banClass))
    const SSUMap : Record<string, BanPaperEntry>  =  small_subunit_map;
    const LSUMap : Record<string, BanPaperEntry>  =  large_subunit_map;

    const [subunit, setSubunit]   =  useState<string>("lsu")
    const [spec, setspec]         =  useState<string>("e")

    const [search, setSearch] = useState<string>("")
    useEffect(() => {
        dispatch({type:"FILTER_BAN_METADATA", payload:search})}, [search])

    const classes= makeStyles({  

        tools: {},
        annotation: { fontSize: 12, },
        authors: {
            transition: "0.1s all",
            "&:hover": {
                background: "rgba(149,149,149,1)",
                cursor: "pointer",
            },
        },
        nested: {
            paddingLeft: 20,
            color: "black"
        },

    })();


    const delayedQuery = useCallback(debounce(q =>setSearch(q), 750), []);

    const banClassObjComparator = (a:BanClassMetadata,b:BanClassMetadata)=>{

        if (parseInt(a.banClass.slice(2))< parseInt(b.banClass.slice(2))){
            return -1
        }
        else if (parseInt(a.banClass.slice(2))> parseInt(b.banClass.slice(2))){
            return 1
        }
        else {
            return 0
        }
    }
    return banClasses.length > 0 ? (
        <Grid xs={12} container item spacing={1} style={{ padding: "5px" }}>
            <Grid xs={2} container item alignContent="flex-start">

                <Grid item container>

        <Typography variant="caption"> Subunit </Typography>
                    <Button size="medium" color={subunit === "lsu" ? "primary" : "secondary"} onClick={() => { setSubunit("lsu") }}>LSU</Button>
                    <Button size="medium" color={subunit === "ssu" ? "primary" : "secondary"} onClick={() => { setSubunit("ssu") }}>SSU</Button>
                    {/* <Button size="medium" color={subunit === "other" ? "primary" : "secondary"} onClick={() => { setSubunit("other") }}>Other</Button> */}

                </Grid>

                <Grid item>
        <Typography variant="caption">Search</Typography>
                    <input onChange={event => delayedQuery(event.target.value)} />
                </Grid>
                <Grid>

{/* <Cart/> */}

                </Grid>

                <DashboardButton />
            </Grid>
            <Grid xs={10} container item spacing={1} >


                <Grid item xs={4} container direction={"column"}>

        <Typography variant="h4"> Universal</Typography>
                    {(()=>{if ( subunit === "lsu" ){
                        return u_LSU;
                    }
                    else {
                        return u_SSU;
                    }
                    })().sort(banClassObjComparator).map(_ => {

                        return <BanClassHero
                            comments          =  {_.comments}
                            avgseqlength      =  {_.avgseqlength}
                            inStructs         =  {_.structs}
                            unique_organisms  =  {_.organisms}
                            nom_class         =  {_.banClass as BanClass}
                            // paperinfo         =  {(subunit ==="lsu" ? LSUMap:SSUMap)[(_.banClass as BanClass)]}
                             />
                    })}
                </Grid>
                <Grid item xs={4} container direction={"column"}>

        <Typography variant="h4"> Eukaryotic </Typography>
                    {(()=>{if ( subunit === "ssu" ){
                        return e_LSU;
                    }
                    else {
                        return e_SSU;
                    }
                    })().sort(banClassObjComparator).map(_ => {

                        return <BanClassHero
                            comments          =  {_.comments}
                            avgseqlength      =  {_.avgseqlength}
                            inStructs         =  {_.structs}
                            unique_organisms  =  {_.organisms}
                            nom_class         =  {_.banClass as BanClass}
                            // paperinfo         =  {(subunit ==="lsu" ? LSUMap:SSUMap)[(_.banClass as BanClass)]} 
                            />
                    })}
                </Grid>
                <Grid item xs={4} container direction={"column"}>

        <Typography variant="h4">Bacterial</Typography>
                    {(()=>{if ( subunit === "lsu" ){
                        return b_LSU;
                    }
                    else {
                        return b_SSU;
                    }
                    })().sort(banClassObjComparator).map(_ => {

                        return <BanClassHero
                            comments          =  {_.comments}
                            avgseqlength      =  {_.avgseqlength}
                            inStructs         =  {_.structs}
                            unique_organisms  =  {_.organisms}
                            nom_class         =  {_.banClass as BanClass}
                            // paperinfo         =  {(subunit ==="lsu" ? LSUMap:SSUMap)[(_.banClass as BanClass)]} 
                            />
                    })}

                </Grid>



            </Grid>
        </Grid>
    ) :
        <SimpleBackdrop />
}

export default RPsCatalogue
