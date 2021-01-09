import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMeasure, useSize } from "react-use";
import { animated, interpolate, useSpring } from "react-spring";
import style from "./grid.module.css";
import { Spring } from "react-spring/renderprops";

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

  const [move, setMove] = useState(0)

  const handleMove = () => {
    setMove( move + 5 )
    setStyles({
      x: 10 + move,
      y: 10 + move
    })
    console.log(move)
  }

  const handleItemClick = (e) => {
    console.log(e.target)
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
    if (!containerWidth) return "0px";
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
    if (!containerWidth) return "0px";
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


  const springGenerator = (i) => {
    const [props, setProps] = useSpring(() => ({
      top: calculateTopPx(
        i,
        defaultItemWidth,
        defaultItemHeight,
        defaultMarginX,
        defaultMarginY,
        defaultWidth
      ),
      left: calculateLeftPx(
        i,
        defaultItemWidth,
        defaultMarginX,
        defaultWidth
      ),
    }));
    return {props, setProps}
  };

  const elements = ["a", "b", "c", "d", "e", "f", "g"]

  const propsidupsi = elements.map((e, i) => springGenerator(i))
  

  const oldPosition = useRef([{},{},{},{},{},{},{}])
  const savePosition = useRef([{},{},{},{},{},{},{}])
  const newPosition = useCallback(
    ( i,
      defaultItemWidth,
      defaultItemHeight,
      defaultMarginX,
      defaultMarginY,
      gridSizeWidth
    ) => {
      oldPosition.current[i] = Object.assign({}, savePosition.current[i])
      const top = calculateTopPx(
        i,
        defaultItemWidth,
        defaultItemHeight,
        defaultMarginX,
        defaultMarginY,
        gridSizeWidth
      );
      const left = calculateLeftPx(
        i,
        defaultItemWidth,
        defaultMarginX,
        gridSizeWidth
      );
      // console.log({top, left})
      savePosition.current[i] = {top, left}
      if (oldPosition.current[3].left !== savePosition.current[3].left){
        console.log(`oldPosition`)
        console.log(oldPosition.current[3].left)
        console.log(`savePosition`)
        console.log(savePosition.current[3].left)
      }
      return propsidupsi[i].setProps({
        from: oldPosition.current[i],
        top, left
      })
    },
    [gridSize.width],
  );

  

  const [styles, setStyles] = useSpring(() => {
    return {
      x: 10 + move,
      y: 10 + move
    }
  })
  
  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={expand}
        ref={gridRef}
      >
        {elements.map((e, i) => (
          // <Spring>
          <animated.div
            key={i}
            className={style.gridItem}
            style={propsidupsi.props[i]}
            // style={{
            // //   //top: `${i * 20 + i * defaultMargin >= 200 ? 20 : 0}px`,
            //   top: calculateTopPx(
            //     i,
            //     defaultItemWidth,
            //     defaultItemHeight,
            //     defaultMarginX,
            //     defaultMarginY,
            //     gridSize.width
            //   ),
            // //   //left: `${(i * 20 + i * defaultMargin) % 200}px`,
            //   left: calculateLeftPx(
            //     i,
            //     defaultItemWidth,
            //     defaultMarginX,
            //     gridSize.width
            //   ),
            // //   transform: interpolate(
            // //     [styles.x, styles.y],
            // //     (x, y) => `translate3d(${x}px, ${y}px, 0)`
            // //   )
            // }}
            onClick={handleItemClick}
          >
            {e}
          </animated.div>
          // </Spring>
        ))}
      </animated.div>
      <animated.button onClick={handleToggle} style={spin}>
        {'<'}
      </animated.button>
      <animated.button onClick={handleMove}>
        {'move'}
      </animated.button>
    </div>
  );
}
