import React, { useState, useEffect, useMemo } from "react";
import { useMeasure, useSize } from "react-use";
import { animated, useSpring, useTransition } from "react-spring";
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
  const [contentWidth, setContentWidth] = useState(defaultWidth);

  const [gridRef, gridSize] = useMeasure();
  const [itemRef, itemSize] = useMeasure();

  // Animations
  const expand = useSpring({
    width: open ? `${halfContainerWidth}px` : `${containerWidth}px`
  });
  const spin = useSpring({
    transform: open ? "rotate(180deg)" : "rotate(0deg)"
  });
  // console.log(gridHeight, gridWidth);

  const handleToggle = () => {
    toggle(!open)
  }

  // number of items that fit into one row
  // lowerbound calculates min to fit all and margin
  // return checks if we can fit another element without margin
  const getMaxItemFit = (itemWidth, marginX, containerWidth) => {
    return Math.ceil((containerWidth - marginX) / (itemWidth + marginX));
  };


  console.log(`gridWidth: ${gridSize.width}`)

  const elements = [
    {key: "a"}, 
    {key: "b"}, 
    {key: "c"}, 
    {key: "d"}, 
    {key: "e"}, 
    {key: "f"}, 
    {key: "g"}
  ]

  

  const gridItems = useMemo(() => {
    

    const calculateTopPx = (
      idx,
      itemWidth,
      itemHeight,
      marginX,
      marginY,
      containerWidth,
      print = false
    ) => {
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
        return `${itemHeight * topOffset + marginY * topOffset}px`;
      }
      return `0px`;
    };

    const calculateLeftPx = (
      idx,
      itemWidth,
      marginX,
      containerWidth,
      print = false
    ) => {
      const leftOffsetRaw = idx * (itemWidth + marginX);
      const maxFit = getMaxItemFit(itemWidth, marginX, containerWidth);
      const adjustedLeftOffset = (idx % maxFit) * (itemWidth + marginX);
      if (print) {
        console.log(`idx = ${idx}`);
        console.log(`leftOffsetRaw = ${leftOffsetRaw}`);
        console.log(`maxFit = ${maxFit}`);
        console.log(`adjustedLeftOffset = ${adjustedLeftOffset}`);
      }
      return leftOffsetRaw < containerWidth - itemWidth
        ? `${leftOffsetRaw % containerWidth}px`
        : `${adjustedLeftOffset}px`;
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
          gridSize.width
        )
      ]
      console.log({...el, xy})
      return {...el, xy}
    })
    console.log(`passing through useMemo`)
    return gridItems
  }, [gridSize.width, elements])


  const transitions = useTransition(gridItems, el => el.key, {
    from: ({xy}) => ({xy, opacity: 0}),
    enter: ({xy}) => ({xy, opacity: 1}),
    update: ({xy}) => ({xy}),
    config: { mass: 5, tension: 500, friction: 100 },
  })

  console.log(transitions)

  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={expand}
        ref={gridRef}
      >
        {transitions.map((el) => {
            const {item, props: { xy, ...rest }, key} = el;
            console.log(el)
            return (
            <animated.div
              key={key}
              className={style.gridItem}
              style={{
                // top: xy[0],
                // left: xy[1],
                transform: xy.interpolate((x, y) => `translate3d(${x},${y},0)`),
                ...rest
              }}
            >
              {item.key}
            </animated.div>)
          })}
      </animated.div>
      <animated.button onClick={handleToggle} style={spin}>
        {'<'}
      </animated.button>
    </div>
  );
}
