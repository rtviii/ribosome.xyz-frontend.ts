import React from 'react'

import loading from  './../../static/loading.gif'

const InlineSpinner = () => {
    return (
        <span className='spin-span'>
            <img id='inlinespinner' src={loading} alt="inline-spinner"/>
        </span>
    )
}

export default InlineSpinner
