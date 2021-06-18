import   Grid                                       from '@material-ui/core/Grid/Grid'
import   List                                       from '@material-ui/core/List/List'
import   React            , { useEffect, useState } from 'react'                                ;
import { makeStyles        }                        from '@material-ui/core/styles'             ;
import   Table                                      from '@material-ui/core/Table'              ;
import   TableBody                                  from '@material-ui/core/TableBody'          ;
import   TableCell                                  from '@material-ui/core/TableCell'          ;
import   TableContainer                             from '@material-ui/core/TableContainer'     ;
import   TableHead                                  from '@material-ui/core/TableHead'          ;
import   TableRow                                   from '@material-ui/core/TableRow'           ;
import   Paper                                      from '@material-ui/core/Paper'              ;
import { large_subunit_map }                        from '../../static/large-subunit-map'       ;
import { small_subunit_map }                        from '../../static/small-subunit-map'       ;
import { DashboardButton   }                        from '../../materialui/Dashboard/Dashboard' ;
import   ListItem                                   from '@material-ui/core/ListItem/ListItem'  ;
import   Button                                     from '@material-ui/core/Button/Button'      ;
import { CSVLink           }                        from 'react-csv'                            ;
import   TextField                                  from '@material-ui/core/TextField/TextField';
import { generatePath } from 'react-router';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
	nom: string,
	 bacterial: string, euk: string, universal: string, pfams: string[]) {
  return { nom, bacterial, euk, universal, pfams };
}

// const rows = [
// ];

export default function Nomenclature (){
const [search, setsearch] = useState('')

const gentable = () =>{

var x = {...large_subunit_map,...small_subunit_map}
  var summary:Array<Array<any>> = []
  summary.push(['nomenclature_class', 'bacteria','yeast','human','pfams'])
  Object.entries(x).map(
	s =>{

  summary.push([s[0],s[1].b,s[1].y,s[1].h,s[1].pfamDomainAccession.reduce((a,b)=>a+","+b, '')])
	}
  )

  return summary

}

	const classes = useStyles();
  const banclasses            = {...large_subunit_map,...small_subunit_map}

  return (
	  <Grid xs={12} container spacing={2}>

<Grid item xs={2}>

<List >

<ListItem>

        <DashboardButton/>
</ListItem>



<ListItem> 
	   <TextField
          id           = "outlined-required"
          label        = "Search"
          defaultValue = ""
          variant      = "outlined"
		  onChange={(e)=>{setsearch(e.target.value)}}
        />
</ListItem>


<ListItem>
	<CSVLink data={gentable()}>
 <Button style={{textTransform:"none"}} color="primary" variant="outlined"> Download as Table</Button>
	</CSVLink>
</ListItem>


</List>

</Grid>
<Grid item xs={10}>

    <TableContainer component={Paper}>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Protein Nomenclature Class</TableCell>

			{/* <TableCell>Annotation</TableCell> */}
			<TableCell>In Bacteria </TableCell>
			<TableCell>In Yeast </TableCell>
			<TableCell>In Human</TableCell>


            <TableCell align="right">Associated PFAM Families</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
			{


Object.entries(banclasses).filter(r=>{ 
	
	if (search ==='Search' || search == ''){return true}
	else {
		return 		( r[0]  +  r[1].b + r[1].y +r[1].h).toLowerCase().includes(search.toLowerCase())
	
	} })
	
	.map(row =>{

  return          <TableRow key={row[0]}>
              <TableCell  scope="row">
                <b>{ row[0] }</b>
              </TableCell>


              <TableCell >{ row[1].b }</TableCell>
              <TableCell >{ row[1].y }</TableCell>
              <TableCell >{ row[1].h }</TableCell>
				  
              <TableCell align="right">{row[1].pfamDomainAccession.map((a)=> <div><a href={`https://pfam.xfam.org/family/${a}`}>{a }</a></div>)}</TableCell>


            </TableRow>
	

})
			}
        </TableBody>
      </Table>
    </TableContainer>

</Grid>

	  </Grid>
  );
}

// 2. U/B/E
// 3. Protein Rows
// 4. Downloadables 
