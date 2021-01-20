import { Grid,Typography, Checkbox } from '@material-ui/core'
import React from 'react'

const SpeciesFilter = ({species}:{species:string[]}) => {
    return (
        <Grid 
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        >

{species.map(r=>{
    return <div style={{width:300,display:"flex",flexDirection:"row",
     alignItems:"center",justifyItems:"spaceBetween"}}>



<div style={{width:200,paddingLeft:10 }}>{r}</div>


  <Checkbox
  
        defaultChecked
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </div>
})}

        </Grid>

    )
}

export default SpeciesFilter
