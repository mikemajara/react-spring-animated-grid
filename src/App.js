import React, { useState, useRef, useMemo } from "react";
import { useMeasure } from "react-use";
import { animated, useTransition } from "react-spring";
import style from "./grid.module.css";

export default function App() {
  const defaultMarginRight = 10;
  const defaultMarginLeft = 10;
  const defaultMarginTop = 10;
  const defaultMarginBottom = 10;

  const defaultItemHeight = 40;
  const defaultItemWidth = 40;

  const containerWidth = 220;
  const containerHeight = 320;

  const widthIncreaseStep = 5

  // The height of the content inside of the accordion
  const [contentWidth, setContentWidth] = useState(containerWidth);

  // const [gridRef, gridSize] = useMeasure();

  // Animations
  // const expand = useSpring({
  //   width: `${contentWidth}px`
  // });
  // const spin = useSpring({
  //   transform: open ? "rotate(180deg)" : "rotate(0deg)"
  // });

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
    { key: "11", bgcolor: "yellow", measure: useMeasure() },
    { key: "12", bgcolor: "magenta", measure: useMeasure() },
    { key: "13", bgcolor: "cyan", measure: useMeasure() },
  ]
  
  const newPositions = useRef(Array.from(elements).fill({}))

  
  const gridItems = useMemo(() => {

    const getItemWidth = (idx) => {
      if (elements[idx])
        return elements[idx].measure[1].width
      return 0
    }

    const calculateLayout = (elements, marginTop, marginRight, marginBottom, marginLeft, containerWidth) => {
      // let t0 = performance.now()
      let currentRow = 0
      let currentTopOffset = 0
      let currentLeftOffset = 0
      let spaceRemainingX = containerWidth
      
      const nextRow = () => {
        currentRow += 1
        currentTopOffset += marginTop + defaultItemHeight + marginBottom
        currentLeftOffset = 0
        spaceRemainingX = containerWidth
      }
      
      elements.forEach((e, i) => {
        const necessarySpaceX = marginLeft + getItemWidth(i) + marginRight
        if (
          spaceRemainingX <= necessarySpaceX && 
          containerWidth > necessarySpaceX
        ){
          nextRow()
        }
        newPositions.current[i] = 
          { row: currentRow, top: currentTopOffset + marginTop, left: currentLeftOffset + marginLeft }
        spaceRemainingX -= necessarySpaceX
        currentLeftOffset += necessarySpaceX
      })
      // let t1 = performance.now()
      // console.log(`Call to calculateLayout took ${t1 - t0} milliseconds.`)
    }

    calculateLayout(elements, defaultMarginTop, defaultMarginRight, defaultMarginBottom, defaultMarginLeft, contentWidth)
    
    let gridItemsCalcs = elements.map((item, i) => {

      const xy = [
        newPositions.current[i].top,
        newPositions.current[i].left
      ]

      item.width = clicked.includes(item.key) ? defaultItemWidth*2 : defaultItemWidth
      return {...item, xy, w: item.width}
    })
    return gridItemsCalcs
  }, [contentWidth, elements, clicked])



  const transitions = useTransition(gridItems, el => el.key, {
    from: ({xy, w}) => ({xy, w, opacity: 0}),
    enter: ({xy, w}) => ({xy, w, opacity: .5}),
    update: ({xy, w}) => ({xy, w}),
    config: { mass: 5, tension: 500, friction: 200 },
  })

  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={{width: contentWidth, height: containerHeight}}
        key={1}
      >
        {transitions.map((el) => {
            const {item, props: { xy, w, ...rest }, key} = el;
            return (
            <animated.div
              key={item.key}
              className={style.gridItem}
              style={{
                width: w,
                height: defaultItemHeight,
                // transform: xy.interpolate((x, y) => `translate3d(${y}px,${x}px, 0px)`),
                top: xy.interpolate((x, y) => `${x}px`),
                left: xy.interpolate((x, y) => `${y}px`),
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
              <animated.div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                backgroundColor: item.bgcolor,
                opacity: 0.7,
                height: "inherit",
              }}>
                {item.key}
              </animated.div>
            </animated.div>)
          })}
      </animated.div>
      <animated.button onClick={() => toggleContentWidth(1/2)} >
        {'1/2'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(2)} >
        {'x2'}
      </animated.button>
      
      <animated.button onClick={() => setContentWidth(contentWidth+widthIncreaseStep)} >
        {'+'}
      </animated.button>
      <animated.button onClick={() => setContentWidth(contentWidth-widthIncreaseStep)} >
        {'-'}
      </animated.button>
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{marginRight: 100}}>
          New calc - containerWidth: {contentWidth}
            <table>
                <thead>
                  <tr>
                    <th>el</th>
                    <th>row</th>
                    {/* <th>leftRaw</th> */}
                    <th>top</th>
                    <th>left</th>
                  </tr>
                </thead>
                <tbody>
                {newPositions.current.map(({row, top, left}, i) =>
                  <tr key={i}>
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
