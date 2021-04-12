import React from 'react'
import { CSVLink } from "react-csv";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {StructReducerState} from '../../../redux/reducers/StructuresReducer/StructuresReducer'
import { AppState } from '../../../redux/store';
import { connect, useSelector } from 'react-redux';

const CSVDownloadElement = ({prop}:{ prop:'proteins'|'structs' }) => {


    const proteins = useSelector((state: AppState) => state.proteins.ban_class_derived)
    const structs = useSelector((state: AppState) => state.structures.derived_filtered)
  var bulkDownloads = []
  if (prop==="proteins"){

    bulkDownloads = [["rcsb_id", "strand", "nomenclature", "sequence"]]
    proteins.map(prot => bulkDownloads.push([prot.parent_rcsb_id, prot.entity_poly_strand_id, prot.nomenclature[0] || "Unspecified", prot.entity_poly_seq_one_letter_code]))
  } else if (prop === "structs") {
    bulkDownloads = [["rcsb_id", "species", "year", "author"]]
    structs.map(s => {
      bulkDownloads.push(
        [s.struct.rcsb_id, s.struct._organismId, s.struct.citation_year, s.struct.citation_rcsb_authors.reduce((acc, next) => acc + next), ""]

      )
    })


  }

  return (

<CSVLink data={prop}>
<Typography variant="body2"> Bulk Download</Typography>

</CSVLink>

            
    )
}


export default CSVDownloadElement;
