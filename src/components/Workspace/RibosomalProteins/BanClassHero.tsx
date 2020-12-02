import React from 'react'
import { Link } from 'react-router-dom';
import "./BanClassHero.css";
import { ERS, BanPaperEntry } from './RPsCatalogue';
import {  OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';

const popover = (prop: ERS) => (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Member proteins</Popover.Title>
    <Popover.Content className='basic-content'>
      {prop.rps.map(rp => {
        return(
            <div className='rp-class-member'>
                <span>{rp.parent_reso} Å | {rp.organism_desc}({rp.organism_id}) in <Link to={`/structs/${rp.parent}`}>{rp.parent}</Link> </span>
            </div>
        );
      })}
    </Popover.Content>
  </Popover>
);



const BanClassHero = ({prop, paperinfo}:{ prop: ERS, paperinfo: BanPaperEntry }) => {
 const renderTooltip = (props:any) => (
  <Tooltip className="legacy-nomenclature" {...props}>
    <table className="leg-nom-table">
      <th>Legacy Nomenclature</th>
      <tr><td>Human</td><td>{paperinfo.h? paperinfo.h : "-"}</td></tr>
      <tr>Bacteria<td>{paperinfo.b?paperinfo.b :"-"}</td></tr>
      <tr>Yeast<td>{paperinfo.y?paperinfo.y :"-"}</td></tr>
    </table>
  </Tooltip>
);

  return (
    <div className="ban-class-hero">
      <div className="banclasses">
        <OverlayTrigger placement="left" overlay={renderTooltip}>
        <Link to={`/rps/${prop.nom_class}`}>
          <h4>{prop.nom_class}</h4>
        </Link>

        </OverlayTrigger>


      </div>
      <div className="stats">
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={popover(prop)}
        >
          <p id="member-chains">Member chains</p>
        </OverlayTrigger>
        <p>Spans {prop.presentIn.length} structures</p>
      </div>
    </div>
  );}

export default BanClassHero
