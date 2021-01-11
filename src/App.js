import React, { useState, useEffect, useMemo } from "react";
import { useMeasure, useSize } from "react-use";
import { animated, interpolate, useSpring, useTransition } from "react-spring";
import style from "./grid.module.css";

export default function App() {
  const defaultMarginX = 20;
  const defaultMarginY = 20;
  const defaultItemHeight = 20;
  const defaultItemWidth = 20;
  const containerWidth = 170;
  const halfContainerWidth = containerWidth/2
  const containerHeight = 200;
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
  const mock = () => [1,2]

  const elements = [
    { key: "a", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "b", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "c", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "d", bgcolor: "cyan", measure: useMeasure() }, 
    { key: "e", bgcolor: "yellow", measure: useMeasure() }, 
    { key: "f", bgcolor: "magenta", measure: useMeasure() }, 
    { key: "g", bgcolor: "cyan", measure: useMeasure() }
  ]
  // eslint-disable-line react-hooks/rules-of-hooks
  // elements.map((_, i) => {[elements[i].ref, elements[i].size] = useMeasure()})
  // for (var i = 0; i< elements.length; i++){
  //   [elements[i].ref, elements[i].size] = useMeasure()
  //   console.log(elements[i])
  // }
  console.log(elements)
    // elements.forEach(e => {e.ref, e.size = useMeasure()})

  const [clicked, setClicked] = useState([])
  
  const gridItems = useMemo(() => {

    const getItemsWidth = (from, to) => 
      from !== to 
        ? elements
        .slice(from, to)
        .reduce((acc, el) => acc + el.measure[1].width, 0)
        : 0

    const getPreviousItemsWidth = (idx) => getItemsWidth(0, idx)
    
    const getLeftOffsetRaw = (idx, marginX) => getPreviousItemsWidth(idx) + idx * marginX;
    
    const getTopOffsetRaw = (idx, marginX, containerWidth) => 
      Math.floor(getLeftOffsetRaw(idx, marginX)/(containerWidth-marginX))

    const getPreviousItemsInRow = (idx, marginX, containerWidth) => {
      let currentItem = idx-1
      let elementsInRow = []
      const topOffsetRaw = getTopOffsetRaw(idx, marginX, containerWidth)
      let currentOffset = getTopOffsetRaw(currentItem, marginX, containerWidth)
      while(currentItem >= 0 && currentOffset == topOffsetRaw){
        elementsInRow.unshift(currentItem)
        // console.log(`currentOffset: ${currentOffset}, currentItem: ${currentItem}, elementsInRow: ${elementsInRow}`)
        currentItem = currentItem -1
        currentOffset = getTopOffsetRaw(currentItem, marginX, containerWidth)
      }
      console.log(`idx ${idx} - row offset: ${topOffsetRaw}, elements: ${elementsInRow}`)
      return elementsInRow
    }

    const getPreviousItemsWidthForRow = (idx, marginX, containerWidth) => {
      const firstItemInRow = getPreviousItemsInRow(idx, marginX, containerWidth)[0] || idx
      const width = getItemsWidth(firstItemInRow, idx)
      console.log(`idx ${idx} - width: ${width}`)
      return width
    }

    const calculateTopPx = (
      idx,
      itemWidth,
      itemHeight,
      marginX,
      marginY,
      containerWidth,
      print = false
    ) => {
      if (!containerWidth) return 0

      const leftOffsetRaw = getLeftOffsetRaw(idx, marginX);
      const topOffsetRaw = getTopOffsetRaw(idx, marginX, containerWidth);

      if (print){
        console.log(`%cidx = ${idx}, element: ${elements[idx].key}`, 'font-weight:bold');
        getPreviousItemsWidthForRow(idx, marginX, containerWidth)
        // console.log(`previousItemsWidth = ${getPreviousItemsWidth(idx)}`);
        // console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        // console.log(`topOffsetRaw = ${topOffsetRaw}`);
        // console.log(`containerWidth = ${containerWidth}`);
      }
      if (topOffsetRaw) {
        /*console.log(`calculating offset for idx: ${idx}`);
        console.log(`
          ${itemHeight} * ${topOffset} + ${itemHeight} * ${marginY} =
          ${itemHeight * topOffset + itemHeight * marginY}px`);*/
        return topOffsetRaw * (itemHeight + marginY);
      }
      return 0;
    };

    const calculateLeftPx = (
      idx,
      itemWidth,
      marginX,
      containerWidth,
      print = false
    ) => {
      if (!containerWidth) return 0

      const leftOffsetRaw = getLeftOffsetRaw(idx, marginX);
      const topOffsetRaw = getTopOffsetRaw(idx, marginX, containerWidth)

      
      // in how many rows of length (containerWidth - marginX) can I fit
      // all the previous boxes
      let adjustedLeftOffset = leftOffsetRaw%(containerWidth - marginX)
      if (adjustedLeftOffset < marginX) adjustedLeftOffset = 0
      adjustedLeftOffset = 
        getPreviousItemsWidthForRow(idx, marginX, containerWidth) + 
        getPreviousItemsInRow(idx, marginX, containerWidth).length * marginX

      // const adjustedLeftOffset = (idx % topOffset) * leftOffsetRaw;
      if (print) {
        console.log(`%cidx = ${idx}, element: ${elements[idx].key}`, 'font-weight:bold');
        console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        console.log(`topOffsetRaw = ${topOffsetRaw}`);
        console.log(`previousItemsWidth = ${getPreviousItemsWidth(idx)}`);
        console.log(`previousItemsWidthForRow = ${getPreviousItemsWidthForRow(idx, marginX, containerWidth)}`);
        console.log(`previousItemsInRow = ${getPreviousItemsInRow(idx, marginX, containerWidth)}`);
        console.log(`adjustedLeftOffset = ${adjustedLeftOffset}`);
        console.log(`containerWidth = ${containerWidth}`);
      }
      // FIXME -> return just one adjustedOffset
      return leftOffsetRaw < containerWidth - marginX
        ? leftOffsetRaw % containerWidth
        : adjustedLeftOffset;
    };
    
    let gridItems = elements.map((el, i) => {
      const xy = [
        calculateTopPx(
          i,
          defaultItemWidth,
          defaultItemHeight,
          defaultMarginX,
          defaultMarginY,
          gridSize.width,
        ),
        calculateLeftPx(
          i,
          defaultItemWidth,
          defaultMarginX,
          gridSize.width,
          true
        )
      ]
      const w = clicked.includes(el.key) ? 50 : 20
      // console.log({...el, xy})
      return {...el, xy, w}
    })
    // console.log(`passing through useMemo`)
    return gridItems
  }, [gridSize.width, elements, clicked])



  const transitions = useTransition(gridItems, el => el.key, {
    from: ({xy, w}) => ({xy, w, opacity: 0}),
    enter: ({xy, w}) => ({xy, w, opacity: .5}),
    update: ({xy, w}) => ({xy, w}),
    config: { mass: 5, tension: 500, friction: 100 },
  })

  // console.log(transitions)

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

    </div>
  );
}
