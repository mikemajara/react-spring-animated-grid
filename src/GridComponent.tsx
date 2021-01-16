import React, { 
  useState,
  useRef,
  useMemo,
  MutableRefObject,
  ReactElement,
} from "react";
// import { useMeasure } from "react-use";
import { animated, useTransition } from "react-spring";
import { useMeasure } from "react-use";
import style from "./grid.module.css";
import { calculateLayout } from './helpers'
import {
  defaultMarginTop,
  defaultMarginRight,
  defaultMarginBottom,
  defaultMarginLeft,
  defaultItemWidth,
  defaultItemHeight,
} from "./defaults";
import { Position } from "./main";

export default function GridComponent(props: any) {
  
  const { 
    style: { width: containerWidth },
    children,
    itemMarginTop = defaultMarginTop,
    itemMarginRight = defaultMarginRight,
    itemMarginBottom = defaultMarginBottom,
    itemMarginLeft = defaultMarginLeft,
  } = props

  const positions: MutableRefObject<Position[]> = useRef<Position[]>(
    new Array(children.length)
  )

  const refMeasures = children.map(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [size, {width, height}] = useMeasure()
    return {size, width, height}
  })

  const gridItems = useMemo(() => {

    calculateLayout(
      children,
      itemMarginTop,
      itemMarginRight,
      itemMarginBottom,
      itemMarginLeft,
      containerWidth
    ).forEach((e,i) => {
      positions.current[i] = {
        ...positions.current[i],
        ...e
      }
    })
    
    let gridItemsCalcs = children.map((item: ReactElement, i: number) => {
      return {
        ...item,
        top: positions.current[i].top,
        left: positions.current[i].left,
        width: refMeasures[i].width
      }
    })
    return gridItemsCalcs
  }, [
    // dependencies: container's width, 
    // and size of each contained element
    containerWidth,
    refMeasures.map((e:any) => e.width),
    refMeasures.map((e:any) => e.height)
  ])



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
        style={{
          width: props.style.width,
          height: props.style.height
        }}
        key={1}
      >
        { children?.length &&
          transitions.map((el,i) => {
            const {item, props: { top, left, width, ...rest }} = el;
            return (
            <animated.div
              key={item.key}
              style={{
                position: "absolute",
                width,
                height: refMeasures[i].height,
                top: top?.interpolate(top => `${top}px`),
                left: left?.interpolate(left => `${left}px`),
                ...rest
              }}
            >
              {
                React.cloneElement(
                  children[i],
                  {
                    ref: refMeasures[i].size
                  }
                )
              }
            </animated.div>)
          })}
      </animated.div>
    </div>
  );
}
