import React, { useState, useRef, useMemo, MutableRefObject } from "react";
// import { useMeasure } from "react-use";
import { animated, useTransition } from "react-spring";
import style from "./grid.module.css";
import { calculateLayout, defaultItemWidth } from "./helpers";
import { Item, Position } from "./main";

export default function Grid() {

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

  const toggleContentWidth = (factor: number) => {
    if (factor === 0) return
    setContentWidth(contentWidth*factor)
  }

  const toggleItemWidth = (key: string) => {
    const idx = elements.current.findIndex(e => e.key === key)
    if (idx >= 0){
      const currWidth = elements.current[idx].width;
      elements.current[idx].width = 
      elements.current[idx].width === defaultItemWidth
        ? defaultItemWidth * ((Math.floor(Math.random() * 10) % 3) + 2)
        : defaultItemWidth
      console.log(`toggling width for item.key: ${key} 
        from: ${currWidth}
        to: ${elements.current[idx].width}`)
    }
  }

  const [clicked, setClicked] = useState(false)

  const elements: MutableRefObject<Item[]> = useRef<Item[]>([
    { key: "1", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "cyan" } }, 
    { key: "2", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "yellow" } }, 
    { key: "3", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "magenta" } }, 
    { key: "4", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "cyan" } }, 
    { key: "5", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "yellow" } }, 
    { key: "6", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "magenta" } }, 
    { key: "7", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "cyan" } },
    { key: "8", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "yellow" } },
    { key: "9", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "magenta" } },
    { key: "10", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "cyan" } },
    { key: "11", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "yellow" } },
    { key: "12", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "magenta" } },
    { key: "13", /*measure: useMeasure() ,*/ width: defaultItemWidth, style: { backgroundColor: "cyan" } },
  ])
  
  const positions: MutableRefObject<Position[]> = useRef<Position[]>(
    new Array(elements.current.length)
  )

  const gridItems = useMemo(() => {
    console.log(`passing through memo`)

    calculateLayout(
      elements.current,
      defaultMarginTop,
      defaultMarginRight,
      defaultMarginBottom,
      defaultMarginLeft,
      contentWidth
    ).forEach((e,i) => {
      positions.current[i] = {
        ...positions.current[i],
        ...e
      }
    })
    
    let gridItemsCalcs = elements.current.map((item, i) => {
      return {
        ...item,
        top: positions.current[i].top,
        left: positions.current[i].left,
        width: item.width
      }
    })
    return gridItemsCalcs
    // FIXME - Mutating the reference elements.current does not trigger the Memo
    // I need to find the way around triggering this with a clicked flag.
  }, [contentWidth, clicked])



  const transitions = useTransition(gridItems, el => el.key, {
    from: ({top, left, width}) => ({top, left, width, opacity: 0}),
    enter: ({top, left, width}) => ({top, left, width, opacity: .5}),
    update: ({top, left, width}) => ({top, left, width, opacity: .5}),
    // config: { mass: 5, tension: 500, friction: 200 },
  })

  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={{width: contentWidth, height: containerHeight}}
        key={1}
      >
        {transitions.map((el) => {
            const {item, props: { top, left, width, ...rest }} = el;
            return (
            <animated.div
              key={item.key}
              className={style.gridItem}
              style={{
                width,
                height: defaultItemHeight,
                // transform: xy.interpolate((x, y) => `translate3d(${y}px,${x}px, 0px)`),
                top: top?.interpolate(top => `${top}px`),
                left: left?.interpolate(left => `${left}px`),
                ...rest
              }}
              onClick={() => {
                toggleItemWidth(item.key);
                setClicked(!clicked)
              }}
            >
              <animated.div style={{
                ...item.style,
                display: "flex", flexDirection: "column", justifyContent: "center",
                opacity: 0.7,
                height: "inherit",
              }}>
                {item.key}
              </animated.div>
            </animated.div>)
          })}
      </animated.div>
      <animated.button onClick={() => toggleContentWidth(2/3)} >
        {'2/3'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(1/2)} >
        {'1/2'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(1.5)} >
        {'x1.5'}
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
              {positions.current.map(({row, top, left}, i) =>
                <tr key={i}>
                  <td>{elements.current[i].key}</td>
                  <td>{row}</td>
                  {/* <td>{leftRaw}</td> */}
                  <td>{top}</td>
                  <td>{left}</td>
                </tr>
              )}
              </tbody>
          </table>
        </div>
        <div style={{marginRight: 100}}>
          elements
          <table>
              <thead>
                <tr>
                  <th>el</th>
                  <th>width</th>
                  <th>style</th>
                </tr>
              </thead>
              <tbody>
              {elements.current.map(({key, width, style}, i) =>
                <tr key={i}>
                  <td>{key}</td>
                  <td>{width}</td>
                  <td>{JSON.stringify(style)}</td>
                </tr>
              )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
