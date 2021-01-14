import React, { useState, useRef, useEffect, useMemo } from "react";
import { useMeasure, useSize } from "react-use";
import { animated, interpolate, useSpring, useTransition } from "react-spring";
import style from "./grid.module.css";

export default function App() {
  const defaultMarginX = 20;
  const defaultMarginY = 20;
  const defaultItemHeight = 20;
  const defaultItemWidth = 20;
  const containerWidth = 120;
  const halfContainerWidth = containerWidth/2
  const containerHeight = 300;
  const defaultHeight = `${containerHeight}px`;
  const defaultWidth = `${containerWidth}px`;

  // Manages the open or cloased state of the accordion
  const [open, toggle] = useState(false);

  // The height of the content inside of the accordion
  const [contentWidth, setContentWidth] = useState(containerWidth);

  const [gridRef, gridSize] = useMeasure();

  // Animations
  // const expand = useSpring({
  //   width: `${contentWidth}px`
  // });
  const spin = useSpring({
    transform: open ? "rotate(180deg)" : "rotate(0deg)"
  });

  const toggleContentWidth = (factor) => {
    if (factor === 0) return
    setContentWidth(contentWidth*factor)
  }

  const [clicked, setClicked] = useState([])

  
  
  const elements = [
    { key: "1", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "2", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "3", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "4", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "5", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "6", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "7", bgcolor: "cyan", measure: useMeasure() },
    { key: "8", bgcolor: "yellow", measure: useMeasure() },
    { key: "9", bgcolor: "magenta", measure: useMeasure() },
    { key: "10", bgcolor: "cyan", measure: useMeasure() },
    // { key: "11", bgcolor: "yellow", measure: useMeasure() },
    // { key: "12", bgcolor: "magenta", measure: useMeasure() },
    // { key: "13", bgcolor: "cyan", measure: useMeasure() },
    // { key: "14", bgcolor: "yellow", measure: useMeasure() },
    // { key: "15", bgcolor: "magenta", measure: useMeasure() },
    // { key: "16", bgcolor: "cyan", measure: useMeasure() },
    // { key: "17", bgcolor: "yellow", measure: useMeasure() },
    // { key: "18", bgcolor: "magenta", measure: useMeasure() },
    // { key: "19", bgcolor: "cyan", measure: useMeasure() },
    // { key: "20", bgcolor: "yellow", measure: useMeasure() },
    // { key: "21", bgcolor: "magenta", measure: useMeasure() },
    // { key: "22", bgcolor: "cyan", measure: useMeasure() },
    // { key: "23", bgcolor: "yellow", measure: useMeasure() },
    // { key: "24", bgcolor: "magenta", measure: useMeasure() },
    // { key: "25", bgcolor: "cyan", measure: useMeasure() },
    // { key: "26", bgcolor: "yellow", measure: useMeasure() },
    // { key: "27", bgcolor: "magenta", measure: useMeasure() },
    // { key: "28", bgcolor: "cyan", measure: useMeasure() },
    // { key: "29", bgcolor: "yellow", measure: useMeasure() },
    // { key: "30", bgcolor: "cyan", measure: useMeasure() }, 
    // { key: "31", bgcolor: "yellow", measure: useMeasure() }, 
    // { key: "32", bgcolor: "magenta", measure: useMeasure() }, 
    // { key: "33", bgcolor: "cyan", measure: useMeasure() }, 
    // { key: "34", bgcolor: "yellow", measure: useMeasure() }, 
    // { key: "35", bgcolor: "magenta", measure: useMeasure() }, 
    // { key: "36", bgcolor: "cyan", measure: useMeasure() },
    // { key: "37", bgcolor: "yellow", measure: useMeasure() },
    // { key: "38", bgcolor: "magenta", measure: useMeasure() },
    // { key: "39", bgcolor: "cyan", measure: useMeasure() },
    // { key: "40", bgcolor: "yellow", measure: useMeasure() },
    // { key: "41", bgcolor: "magenta", measure: useMeasure() },
    // { key: "42", bgcolor: "cyan", measure: useMeasure() },
    // { key: "43", bgcolor: "yellow", measure: useMeasure() },
    // { key: "44", bgcolor: "magenta", measure: useMeasure() },
    // { key: "45", bgcolor: "cyan", measure: useMeasure() },
    // { key: "46", bgcolor: "yellow", measure: useMeasure() },
    // { key: "47", bgcolor: "magenta", measure: useMeasure() },
    // { key: "48", bgcolor: "cyan", measure: useMeasure() },
    // { key: "49", bgcolor: "yellow", measure: useMeasure() },
    // { key: "50", bgcolor: "magenta", measure: useMeasure() },
    // { key: "51", bgcolor: "cyan", measure: useMeasure() },
    // { key: "52", bgcolor: "yellow", measure: useMeasure() },
    // { key: "53", bgcolor: "magenta", measure: useMeasure() },
    // { key: "54", bgcolor: "cyan", measure: useMeasure() },
    // { key: "55", bgcolor: "yellow", measure: useMeasure() },
    // { key: "56", bgcolor: "magenta", measure: useMeasure() },
    // { key: "57", bgcolor: "cyan", measure: useMeasure() },
    // { key: "58", bgcolor: "yellow", measure: useMeasure() },
    // { key: "59", bgcolor: "magenta", measure: useMeasure() },
    // { key: "60", bgcolor: "cyan", measure: useMeasure() },
    // { key: "61", bgcolor: "yellow", measure: useMeasure() },
    // { key: "62", bgcolor: "magenta", measure: useMeasure() },
    // { key: "63", bgcolor: "cyan", measure: useMeasure() },
    // { key: "64", bgcolor: "yellow", measure: useMeasure() },
    // { key: "65", bgcolor: "magenta", measure: useMeasure() },
    // { key: "66", bgcolor: "cyan", measure: useMeasure() },
    // { key: "67", bgcolor: "yellow", measure: useMeasure() },
    // { key: "68", bgcolor: "magenta", measure: useMeasure() },
    // { key: "69", bgcolor: "cyan", measure: useMeasure() },
    // { key: "70", bgcolor: "yellow", measure: useMeasure() },
    // { key: "71", bgcolor: "magenta", measure: useMeasure() },
    // { key: "72", bgcolor: "cyan", measure: useMeasure() },
    // { key: "73", bgcolor: "yellow", measure: useMeasure() },
    // { key: "74", bgcolor: "magenta", measure: useMeasure() },
    // { key: "75", bgcolor: "cyan", measure: useMeasure() },
    // { key: "76", bgcolor: "yellow", measure: useMeasure() },
    // { key: "77", bgcolor: "magenta", measure: useMeasure() },
    // { key: "78", bgcolor: "cyan", measure: useMeasure() },
    // { key: "79", bgcolor: "yellow", measure: useMeasure() },
    // { key: "80", bgcolor: "cyan", measure: useMeasure() }, 
    // { key: "81", bgcolor: "yellow", measure: useMeasure() }, 
    // { key: "82", bgcolor: "magenta", measure: useMeasure() }, 
    // { key: "83", bgcolor: "cyan", measure: useMeasure() }, 
    // { key: "84", bgcolor: "yellow", measure: useMeasure() }, 
    // { key: "85", bgcolor: "magenta", measure: useMeasure() }, 
    // { key: "86", bgcolor: "cyan", measure: useMeasure() },
    // { key: "87", bgcolor: "yellow", measure: useMeasure() },
    // { key: "88", bgcolor: "magenta", measure: useMeasure() },
    // { key: "89", bgcolor: "cyan", measure: useMeasure() },
    // { key: "90", bgcolor: "yellow", measure: useMeasure() },
    // { key: "91", bgcolor: "magenta", measure: useMeasure() },
    // { key: "92", bgcolor: "cyan", measure: useMeasure() },
    // { key: "93", bgcolor: "yellow", measure: useMeasure() },
    // { key: "94", bgcolor: "magenta", measure: useMeasure() },
    // { key: "95", bgcolor: "cyan", measure: useMeasure() },
    // { key: "96", bgcolor: "yellow", measure: useMeasure() },
    // { key: "97", bgcolor: "magenta", measure: useMeasure() },
    // { key: "98", bgcolor: "cyan", measure: useMeasure() },
    // { key: "99", bgcolor: "yellow", measure: useMeasure() },
  ]
  
  const newPositions = useRef(Array.from(elements).fill({}))

  const getItemWidth = (idx) => {
    if (elements[idx])
      return elements[idx].measure[1].width
    return 0
  }

  const calculateLayout = (elements, marginTop, marginRight, marginBottom, marginLeft, containerWidth) => {
    
    let currentRow = 0
    let currentTopOffset = 0
    let currentLeftOffset = 0
    let spaceRemainingX = containerWidth
    
    const nextRow = () => {
      currentRow += 1
      currentTopOffset += defaultItemHeight // TODO adjust to variable height
      currentLeftOffset = 0
      spaceRemainingX = containerWidth
    }
    
    elements.forEach((e, i) => {
      const necessarySpaceX = marginLeft + getItemWidth(i) + marginRight
      while (spaceRemainingX <= necessarySpaceX && containerWidth > getItemWidth(i)){
        nextRow()
      }
      // console.log(`updating ${i}: row - ${currentRow}, top - ${currentTopOffset + marginTop}, left - ${currentLeftOffset + marginLeft}`)
      newPositions.current[i] = 
        { row: currentRow, top: currentTopOffset + marginTop, left: currentLeftOffset + marginLeft }
      // console.log(newPositions)
      spaceRemainingX -= necessarySpaceX
      currentLeftOffset += necessarySpaceX
    })
  }
  
  const gridItems = useMemo(() => {
    calculateLayout(elements, 0, 0, 20, 0, contentWidth)
    
    let gridItemsCalcs = elements.map((el, i) => {

      const xy = [
        newPositions.current[i].top,
        newPositions.current[i].left
      ]

      const w = clicked.includes(el.key) ? 50 : 20
      return {...el, xy, w}
    })
    // console.log(`passing through useMemo`)
    return gridItemsCalcs
  }, [gridSize.width, elements, clicked])



  const transitions = useTransition(gridItems, el => el.key, {
    from: ({xy, w}) => ({xy, w, opacity: 0}),
    enter: ({xy, w}) => ({xy, w, opacity: .5}),
    update: ({xy, w}) => ({xy, w}),
    config: { mass: 5, tension: 500, friction: 100 },
  })

  // console.log(oldPositions.current)
  
  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={{width: contentWidth}}
        ref={gridRef}
      >
        {transitions.map((el) => {
            const {item, props: { xy, w, ...rest }, key} = el;
            return (
            <animated.div
              key={key}
              className={style.gridItem}
              style={{
                backgroundColor: item.bgcolor,
                opacity: 0.7,
                width: w,//.interpolate(x => `scaleY(${x}px)`),
                transform: xy.interpolate((x, y) => `translate3d(${y}px,${x}px, 0px)`),
                ...rest
              }}
              ref={item.measure[0]}
              onClick={() => {
                if (clicked.includes(item.key)){
                  setClicked(clicked.filter(e => e !== item.key))
                }else{
                  setClicked([...clicked, item.key])
                }
              }}
            >
              {item.key}
            </animated.div>)
          })}
      </animated.div>
      <animated.button onClick={() => toggleContentWidth(1/2)} style={spin}>
        {'<'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(2)} style={spin}>
        {'>'}
      </animated.button>
      
      <animated.button onClick={() => setContentWidth(contentWidth+2)} style={spin}>
        {'+'}
      </animated.button>
      <animated.button onClick={() => setContentWidth(contentWidth-2)} style={spin}>
        {'-'}
      </animated.button>
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{marginRight: 100}}>
          New calc - containerWidth: {contentWidth}
            <table>
                <thead>
                  <th>el</th>
                  <th>row</th>
                  {/* <th>leftRaw</th> */}
                  <th>top</th>
                  <th>left</th>
                </thead>
                <tbody>
                {newPositions.current.map(({row, top, left}, i) =>
                  <tr>
                    <td>{elements[i].key}</td>
                    <td>{row}</td>
                    {/* <td>{leftRaw}</td> */}
                    <td>{top}</td>
                    <td>{left}</td>
                  </tr>
                )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
