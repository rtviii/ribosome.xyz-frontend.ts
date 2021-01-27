import React from 'react'
import LoadingSpinner from '../../Other/LoadingSpinner'
import BanClassHero from './BanClassHero'
import './RPCatalogueGrid.css'


const RPCatalogueGrid = (proteins:[]) => {
    
        
        return proteins ? (
        <div>
            <div className='subunit-members'>
            {proteins.sort().map(x => {
              return <BanClassHero {...x} />;
            })}
            </div>
        </div>) : <LoadingSpinner annotation='Fetching proteins...'/>
}
export default RPCatalogueGrid
