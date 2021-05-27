import React from 'react'
import { CSVLink } from "react-csv";
import Typography from '@material-ui/core/Typography';

const BulkDownload = (data:any) => {
    return (
        <div>
    <CSVLink data={data}>
    <Typography variant="body2"> Download Fitlered</Typography>

    </CSVLink>
            
        </div>
    )
}

export default BulkDownload
