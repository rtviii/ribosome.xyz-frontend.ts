import React from 'react'
import './LoadingSpinner.css'
import {Spinner} from 'react-bootstrap'

const LoadingSpinner = ({annotation}:{annotation:string}) => {
    return (
        <div className="loading-spinner">
{ 
annotation.length > 1 ?
<div className='spin-text spn-row'>{annotation}</div>:null

 }
            <div className="spin-circle spn-row"><Spinner animation='grow'/></div>
            
        </div>
    )
}

export default LoadingSpinner
