import React, { useState, useEffect } from "react";
import { useMeasure, useSize } from "react-use";
import { animated, useSpring } from "react-spring";
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

  console.log(`gridWidth: ${gridSize.width}`)

  // useEffect(() => {
  //   // console.log(`setContentWidth(${gridSize.width})`)

  //   //Sets initial height
  //   setContentWidth(gridSize.width);
  
  //   //Adds resize event listener
  //   window.addEventListener("resize", setContentWidth(gridSize.width));
  
  //   // Clean-up
  //   return window.removeEventListener("resize", setContentWidth(gridSize.width));
  // }, [gridSize.width]);

  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={expand}
        ref={gridRef}
      >
        {["a", "b", "c", "d", "e", "f", "g"].map((e, i) => (
          <div
            key={i}
            className={style.gridItem}
            style={{
              //top: `${i * 20 + i * defaultMargin >= 200 ? 20 : 0}px`,
              top: calculateTopPx(
                i,
                defaultItemWidth,
                defaultItemHeight,
                defaultMarginX,
                defaultMarginY,
                gridSize.width
              ),
              //left: `${(i * 20 + i * defaultMargin) % 200}px`,
              left: calculateLeftPx(
                i,
                defaultItemWidth,
                defaultMarginX,
                gridSize.width
              ),
            }}
          >
            {e}
          </div>
        ))}
      </animated.div>
      <animated.button onClick={handleToggle} style={spin}>
        {'<'}
      </animated.button>
    </div>
  );
}
