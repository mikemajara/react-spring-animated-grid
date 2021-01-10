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
    
    // number of items that fit into one row
    // lowerbound calculates min to fit all and margin
    // return checks if we can fit another element without margin
    const getMaxItemFit = (itemWidth, marginX, containerWidth) => {
      return Math.ceil((containerWidth - marginX) / (itemWidth + marginX));
    };

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
      const leftOffsetRaw = idx * (itemWidth + marginX);
      const topOffset = Math.floor(
        idx / getMaxItemFit(itemWidth, marginX, containerWidth)
      );

      if (print)
        console.log(
          `topOffset: ${leftOffsetRaw}/(${containerWidth}-${itemWidth}) = ${
            leftOffsetRaw / (containerWidth - itemWidth)
          }`
        );
      if (topOffset) {
        /*console.log(`calculating offset for idx: ${idx}`);
        console.log(`
          ${itemHeight} * ${topOffset} + ${itemHeight} * ${marginY} =
          ${itemHeight * topOffset + itemHeight * marginY}px`);*/
        return topOffset * (itemHeight + marginY);
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

      const previousItemsWidth = elements
        .slice(0,idx)
        .reduce((acc, el) => acc + el.measure[1].width, 0)

      const leftOffsetRaw = previousItemsWidth + idx * marginX;
      const maxFit = getMaxItemFit(previousItemsWidth, marginX, containerWidth);
      // in how many rows of length (containerWidth - marginX) can I fit
      // all the previous boxes
      const topOffset = Math.ceil((containerWidth-marginX)/leftOffsetRaw)
      const adjustedLeftOffset = leftOffsetRaw%containerWidth
      // const adjustedLeftOffset = (idx % topOffset) * leftOffsetRaw;
      if (print) {
        console.log(`%cidx = ${idx}, element: ${elements[idx].key}`, 'font-weight:bold');
        console.log(`previousItemsWidth = ${previousItemsWidth}`);
        console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        console.log(`maxFit = ${maxFit}`);
        console.log(`topOffset = ${topOffset}`);
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
          gridSize.width
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
