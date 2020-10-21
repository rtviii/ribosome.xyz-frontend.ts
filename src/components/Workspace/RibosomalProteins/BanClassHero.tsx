import React from 'react'
import infoicon from "./../../../static/info.svg";
import { Link } from 'react-router-dom';
import "./BanClassHero.css";
import { endpointResponseShape } from './RPsCatalogue';
import { OverlayTrigger } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';


const popover = (prop: endpointResponseShape) => (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Member proteins</Popover.Title>
    <Popover.Content className='basic-content'>
      {prop.rps.map(rp => {
        return(
            <div className='rp-class-member'>
                <span>{rp.parent_reso} Å | {rp.organism_desc}({rp.organism_id}) in <Link to={`/catalogue/${rp.parent}`}>{rp.parent}</Link> </span>
            </div>
        );
      })}
    </Popover.Content>
  </Popover>
);



const BanClassHero = (prop: endpointResponseShape) => {
  return (
    <div className="ban-class-hero">
      <Link to={`/rps/${prop.nom_class}`}>
        <h4>{prop.nom_class}</h4>
      </Link>
      <div className="stats">
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover(prop)}>
          <p id='member-chains'>Member chains</p>
          </OverlayTrigger>
        <p>
          Spans {prop.presentIn.length} structures
        </p>
      </div>
    </div>
  );}

export default BanClassHero
