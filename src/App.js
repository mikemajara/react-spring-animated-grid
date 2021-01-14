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
    { key: "11", bgcolor: "yellow", measure: useMeasure() },
    { key: "12", bgcolor: "magenta", measure: useMeasure() },
    { key: "13", bgcolor: "cyan", measure: useMeasure() },
    { key: "14", bgcolor: "yellow", measure: useMeasure() },
    { key: "15", bgcolor: "magenta", measure: useMeasure() },
    { key: "16", bgcolor: "cyan", measure: useMeasure() },
    { key: "17", bgcolor: "yellow", measure: useMeasure() },
    { key: "18", bgcolor: "magenta", measure: useMeasure() },
    { key: "19", bgcolor: "cyan", measure: useMeasure() },
    { key: "20", bgcolor: "yellow", measure: useMeasure() },
    { key: "21", bgcolor: "magenta", measure: useMeasure() },
    { key: "22", bgcolor: "cyan", measure: useMeasure() },
    { key: "23", bgcolor: "yellow", measure: useMeasure() },
    { key: "24", bgcolor: "magenta", measure: useMeasure() },
    { key: "25", bgcolor: "cyan", measure: useMeasure() },
    { key: "26", bgcolor: "yellow", measure: useMeasure() },
    { key: "27", bgcolor: "magenta", measure: useMeasure() },
    { key: "28", bgcolor: "cyan", measure: useMeasure() },
    { key: "29", bgcolor: "yellow", measure: useMeasure() },
    { key: "30", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "31", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "32", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "33", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "34", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "35", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "36", bgcolor: "cyan", measure: useMeasure() },
    { key: "37", bgcolor: "yellow", measure: useMeasure() },
    { key: "38", bgcolor: "magenta", measure: useMeasure() },
    { key: "39", bgcolor: "cyan", measure: useMeasure() },
    { key: "40", bgcolor: "yellow", measure: useMeasure() },
    { key: "41", bgcolor: "magenta", measure: useMeasure() },
    { key: "42", bgcolor: "cyan", measure: useMeasure() },
    { key: "43", bgcolor: "yellow", measure: useMeasure() },
    { key: "44", bgcolor: "magenta", measure: useMeasure() },
    { key: "45", bgcolor: "cyan", measure: useMeasure() },
    { key: "46", bgcolor: "yellow", measure: useMeasure() },
    { key: "47", bgcolor: "magenta", measure: useMeasure() },
    { key: "48", bgcolor: "cyan", measure: useMeasure() },
    { key: "49", bgcolor: "yellow", measure: useMeasure() },
    { key: "50", bgcolor: "magenta", measure: useMeasure() },
    { key: "51", bgcolor: "cyan", measure: useMeasure() },
    { key: "52", bgcolor: "yellow", measure: useMeasure() },
    { key: "53", bgcolor: "magenta", measure: useMeasure() },
    { key: "54", bgcolor: "cyan", measure: useMeasure() },
    { key: "55", bgcolor: "yellow", measure: useMeasure() },
    { key: "56", bgcolor: "magenta", measure: useMeasure() },
    { key: "57", bgcolor: "cyan", measure: useMeasure() },
    { key: "58", bgcolor: "yellow", measure: useMeasure() },
  ]
  
  const gridItems = useRef([])
  const oldPositions = useRef(Array.from(elements).fill({}))
  const newPositions = useRef(Array.from(elements).fill({}))

  const updatePosition = (idx, topRaw, leftRaw, top, left) => {
    if (idx === 0){
      oldPositions.current[idx] = {topRaw, leftRaw, top, left}
    }else if (Object.keys(oldPositions.current[idx-1]).length){
      oldPositions.current[idx] = {topRaw, leftRaw, top, left}
    }
  }

  const getItemWidth = (idx) => {
    if (elements[idx])
      return elements[idx].measure[1].width
    return 0
  }

  const calculateLayout = (elements, marginTop, marginRight, marginBottom, marginLeft, containerWidth) => {
    // FIXME what if item does not fit!? 
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
      while (spaceRemainingX <= necessarySpaceX){
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
  
  useEffect(() => {
    calculateLayout(elements, 0, 0, 20, 0, contentWidth)
  },[...elements])

  useEffect(() => {
    const getItemWidth = (idx) => {
      if (elements[idx])
        return elements[idx].measure[1].width
      return 0
    }

    const getItemsWidth = (from, to) => 
      from !== to 
        ? elements
        .slice(from, to)
        .reduce((acc, el) => acc + el.measure[1].width, 0)
        : 0

    const getPreviousItemsWidth = (idx) => getItemsWidth(0, idx)
    
    const getLeftOffsetRaw = (idx) => getPreviousItemsWidth(idx);
    
    const getTopOffsetRaw = (idx, containerWidth) => {
      const leftRaw = getLeftOffsetRaw(idx)
      const itemWidth = getItemWidth(idx)
      
      const offsetRaw = (leftRaw + itemWidth)/containerWidth
      const offset = Math.floor(offsetRaw)
      
      return offset
    }

    const getAdjustedTopOffsetRaw = (idx) => oldPositions.current[idx].topRaw

    const getPreviousItemsInRow = (idx, containerWidth) => {
      let currentItem = idx-1
      let elementsInRow = []
      const adjustedTopOffsetRaw = getAdjustedTopOffsetRaw(idx)
      // console.log(`filtering out in getPreviousItemsInRow(${idx}, ${containerWidth}) - `)
      // console.log(`positions.current:`)
      // console.log(positions.current)
      oldPositions.current
        .slice(0,idx)
        .forEach(({topRaw}, i) => {if (topRaw === adjustedTopOffsetRaw) elementsInRow.push(i)})
      // console.log(`returning:`)
      // console.log(elementsInRow)
      return elementsInRow
      // let currentOffset = getTopOffsetRaw(currentItem, containerWidth)
      // while(currentItem >= 0 && currentOffset == topOffsetRaw){
      //   elementsInRow.unshift(currentItem)
      //   // console.log(`currentOffset: ${currentOffset}, currentItem: ${currentItem}, elementsInRow: ${elementsInRow}`)
      //   currentItem = currentItem -1
      //   currentOffset = getTopOffsetRaw(currentItem, containerWidth)
      // }
      // console.log(`getPreviousItemsInRow(${idx}, ${containerWidth}) = ${elementsInRow}`)
      // return elementsInRow
    }

    const getPreviousItemsWidthForRow = (idx, containerWidth) => {
      const previousItems = getPreviousItemsInRow(idx, containerWidth)
      // console.log(previousItems)
      const firstItemInRow = previousItems.length ? previousItems[0] : idx
      const width = getItemsWidth(firstItemInRow, idx)
      // console.log(`getItemsWidth(${firstItemInRow}, ${idx}) = ${width}`)
      return width
    }

    const calculateTopPx = (
      idx,
      itemHeight,
      marginY,
      containerWidth,
      print = false
    ) => {
      if (!containerWidth) return [0,0]

      const leftOffsetRaw = getLeftOffsetRaw(idx);
      let topOffsetRaw = getTopOffsetRaw(idx, containerWidth);

      const piwfr = getPreviousItemsWidthForRow(idx, containerWidth)
      const iw = getItemWidth(idx)

      if (containerWidth < (piwfr + iw)){
        topOffsetRaw++
      }

      const adjustedTopOffset = topOffsetRaw
        ? topOffsetRaw * (itemHeight + marginY)
        : 0

      if (print){
        console.log(`%ccalculateTopPx - idx = ${idx}, element: ${elements[idx].key}`, 'font-weight:bold');
        console.log(`getPreviousItemsWidthForRow(${idx}, ${containerWidth}) = ${piwfr}`)
        // console.log(`previousItemsWidth = ${getPreviousItemsWidth(idx)}`);
        // console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        // console.log(`topOffsetRaw = ${topOffsetRaw}`);
        // console.log(`containerWidth = ${containerWidth}`);
      }
      
      return [topOffsetRaw, adjustedTopOffset];
    };

    const calculateLeftPx = (
      idx,
      containerWidth,
      print = false
    ) => {
      if (!containerWidth) return [0,0]

      if (print) console.log(`%ccalculateLeftPx - idx = ${idx}, element: ${elements[idx].key}`, 'font-weight:bold');


      const leftOffsetRaw = getLeftOffsetRaw(idx);
      // const topOffsetRaw = getTopOffsetRaw(idx,  containerWidth)
      const adjustedTopOffsetRaw = getAdjustedTopOffsetRaw(idx)

      // in how many rows of length (containerWidth - marginX) can I fit
      // all the previous boxes
      let piwfr = 
        getPreviousItemsWidthForRow(idx,  containerWidth)
      let adjustedLeftOffset = piwfr

      const iw = getItemWidth(idx)

      // if (containerwidth < (adjustedLeftOffset + iw)){
      //   left
      // }
        

      // const adjustedLeftOffset = (idx % topOffset) * leftOffsetRaw;
      if (print) {
        // console.log(`itemWidth = ${getItemWidth(idx)}`);
        // console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        console.log(`adjustedTopOffsetRaw = ${adjustedTopOffsetRaw}`);
        // console.log(`previousItemsWidth = ${getPreviousItemsWidth(idx)}`);
        console.log(`previousItemsWidthForRow = ${piwfr}`);
        // // console.log(`previousItemsInRow = ${getPreviousItemsInRow(idx, containerWidth)}`);
        // console.log(`adjustedLeftOffset = ${adjustedLeftOffset}`);
        // console.log(`containerWidth = ${containerWidth}`);
      }
      // FIXME -> return just one adjustedOffset
      // adjustedLeftOffset = (adjustedLeftOffset + getItemWidth(idx)) < containerWidth
      //   ? leftOffsetRaw % containerWidth
      //   : adjustedLeftOffset;

      return [leftOffsetRaw, adjustedLeftOffset];
    };
    
    let gridItemsCalcs = elements.map((el, i) => {
      // const [topRaw, top] = 
      //   calculateTopPx(
      //     i,
      //     defaultItemHeight,
      //     defaultMarginY,
      //     gridSize.width,
      //     // true
      //   );
      // const [leftRaw, left] =
      //   calculateLeftPx(
      //     i,
      //     gridSize.width,
      //     // true
      //   );
      // console.log(`containerWidth: ${gridSize.width}`)
      const xy = [
        newPositions.current[i].top,
        newPositions.current[i].left
      ]
      // updatePosition(i, 
      //   topRaw,
      //   leftRaw,// getLeftOffsetRaw(i),
      //   top, left)
      const w = clicked.includes(el.key) ? 50 : 20
      // console.log({...el, xy})
      return {...el, xy, w}
    })
    // console.log(`passing through useMemo`)
    gridItems.current = gridItemsCalcs
  }, [gridSize.width, elements, clicked])



  const transitions = useTransition(gridItems.current, el => el.key, {
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
                // const el = elements.find(e => e.key == item.key)
                // elements[0].clicked = !elements[0].clicked
                // // elements[elements.findIndex(e => e.key == item.key)].clicked = !el.clicked
                // setAnyClicked(elements.some(e => e.clicked))
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
        <div>
          Old calc
            <table>
                <thead>
                  <th>el</th>
                  <th>topRaw</th>
                  <th>leftRaw</th>
                  <th>top</th>
                  <th>left</th>
                </thead>
                <tbody>
                {oldPositions.current.map(({topRaw, leftRaw, top, left}, i) =>
                  <tr>
                    <td>{elements[i].key}</td>
                    <td>{topRaw}</td>
                    <td>{leftRaw}</td>
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
