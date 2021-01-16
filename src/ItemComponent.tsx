import React, { useState, useRef, useMemo, MutableRefObject, ReactPropTypes } from "react";
// import { useMeasure } from "react-use";
import { animated, useTransition } from "react-spring";
import style from "./grid.module.css";
import {
  calculateLayout,
  defaultItemWidth,
  defaultMarginTop,
  defaultMarginRight,
  defaultMarginBottom,
  defaultMarginLeft,
  defaultItemHeight,
} from "./helpers";
import { Position } from "./main";
import { CSSProperties } from "react";

interface ItemProps extends ReactPropTypes{
  style: CSSProperties;
  // {
  //   width: string;
  //   height: string;
  //   color: string;  
  // }
}

const defaultStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  opacity: 0.7,
  height: "inherit",
}

export default function ItemComponent(props: any) {

  // const toggleItemWidth = (key: string) => {
  //   const idx = elements.current.findIndex(e => e.key === key)
  //   if (idx >= 0){
  //     const currWidth = elements.current[idx].width;
  //     elements.current[idx].width = 
  //     elements.current[idx].width === defaultItemWidth
  //       ? defaultItemWidth * ((Math.floor(Math.random() * 10) % 3) + 2)
  //       : defaultItemWidth
  //     console.log(`toggling width for item.key: ${key} 
  //       from: ${currWidth}
  //       to: ${elements.current[idx].width}`)
  //   }
  // }

  // const [clicked, setClicked] = useState(false)

  return (
    <div
      className={style.gridItem}
      style={{...defaultStyle, ...props.style}}
      // onClick={() => {
      //   toggleItemWidth(item.key);
      //   setClicked(!clicked)
      // }}
    >
        {props.children}
    </div>
  );
}
