import React from 'react'
import './LoadingSpinner.css'
import {Spinner} from 'react-bootstrap'

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">

            <div className='spin-text spn-row'>The data are being loaded.</div>
            <div className="spin-circle spn-row"><Spinner animation='grow'/></div>
            
        </div>
    )
}

export default LoadingSpinner
