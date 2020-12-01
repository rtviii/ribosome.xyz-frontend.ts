import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown/with-html";
import gfm from "remark-gfm";
import * as md_files from './../../md/exports'
import  './ReactMarkdownElement.css'

const ReactMarkdownElement = ({md}:{md:any}) => {
  const rmdrenderes = {
    image: ({
      alt,
      src,
      title,
    }: {
      alt?: string;
      src?: string;
      title?: string;
    }) => (
      <img
        alt={alt}
        src={src}
        id="md-elem-img"
        title={title}
        style={{ maxWidth: 475, margin: "40px" }}
      />
    )
  };

  const [currmd, setcurrmd] = useState<string>('')
  useEffect(() => {
    Axios.get(md).then( md=>
      setcurrmd(md.data)
    )
  }, [])

    return (
        <div className='md-elem'>
            
            <ReactMarkdown
              plugins    = {[gfm]}
              renderers  = {rmdrenderes}
              source     = {currmd}
              escapeHtml = {false}
            />
        </div>
    )
}

export  {md_files, ReactMarkdownElement}
