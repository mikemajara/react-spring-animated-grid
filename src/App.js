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
  const [itemRef, itemSize] = useMeasure();

  // Animations
  // const expand = useSpring({
  //   width: `${contentWidth}px`
  // });
  const spin = useSpring({
    transform: open ? "rotate(180deg)" : "rotate(0deg)"
  });

  const handleToggle = () => {
    toggle(!open)
  }

  // number of items that fit into one row
  // lowerbound calculates min to fit all and margin
  // return checks if we can fit another element without margin
  const getMaxItemFit = (itemWidth, marginX, containerWidth) => {
    return Math.ceil((containerWidth - marginX) / (itemWidth + marginX));
  };


  // console.log(`gridWidth: ${gridSize.width}`)

  const elements = [
    {key: "a"}, 
    {key: "b"}, 
    {key: "c"}, 
    {key: "d"}, 
    {key: "e"}, 
    {key: "f"}, 
    {key: "g"}
  ]

  const [clicked, setClicked] = useState([])
  
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
        ? leftOffsetRaw % containerWidth
        : adjustedLeftOffset;
    };
    
    let gridItems = elements.map((el, i) => {
      console.log(el)
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
      const w = clicked.includes(el.key) ? 50 : 20
      // console.log({...el, xy})
      return {...el, xy, w}
    })
    // console.log(`passing through useMemo`)
    return gridItems
  }, [gridSize.width, elements, clicked])



  const transitions = useTransition(gridItems, el => el.key, {
    from: ({xy, w}) => ({xy, w, opacity: 0}),
    enter: ({xy, w}) => ({xy, w, opacity: 1}),
    update: ({xy, w}) => ({xy, w}),
    config: { mass: 5, tension: 500, friction: 100 },
  })

  console.log(transitions)

  return (
    <div>
      <animated.div
        className={style.gridContainer}
        style={{width: contentWidth}}
        ref={gridRef}
      >
        {transitions.map((el) => {
            const {item, props: { xy, w, ...rest }, key} = el;
            console.log(w)
            return (
            <animated.div
              key={key}
              className={style.gridItem}
              style={{
                width: w,//.interpolate(x => `scaleY(${x}px)`),
                transform: xy.interpolate((x, y) => `translate3d(${y}px,${x}px, 0px)`),
                ...rest
              }}
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
      <animated.button onClick={handleToggle} style={spin}>
        {'<'}
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
