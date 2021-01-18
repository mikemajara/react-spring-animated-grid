import React, { 
  useState,
  useRef,
  useMemo,
  MutableRefObject,
  ReactElement,
  PropsWithChildren,
  CSSProperties,
} from "react";
// import { useMeasure } from "react-use";
import { animated, AnimatedValue, useTransition } from "react-spring";
import { useMeasure } from "react-use";
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


export interface RequiredStyleFields extends CSSProperties {
  // width: number
  // height: number
}

export interface GridProps{
  // width: number; height: number;
  children: ReactElement[],
  style: RequiredStyleFields,
  itemMarginTop?: number,
  itemMarginRight?: number,
  itemMarginBottom?: number,
  itemMarginLeft?: number,
}

export function GridComponent(props: GridProps) {
  
  const { 
    style: containerStyle,
    children,
    itemMarginTop = defaultMarginTop,
    itemMarginRight = defaultMarginRight,
    itemMarginBottom = defaultMarginBottom,
    itemMarginLeft = defaultMarginLeft,
  } = props

  const [containerRefMeasure, {width: containerWidth, height: containerHeight}] = useMeasure<HTMLDivElement>()

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
      refMeasures,
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
        // FIXME -- how to force key to be non null value.
        key: item.key || 0,
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
    from: ({ top, left }) => ({ top, left }),
    enter: ({ top, left }) => ({ top, left }),
    update: ({ top, left }) => ({ top, left }),
    // config: { mass: 5, tension: 500, friction: 200 },
  })

  return (
    <div
      style={{
        ...containerStyle,
        position: "relative",
      }}
      ref={containerRefMeasure}
    >
      { children?.length &&
        transitions.map((el,i) => {
          const {item, props: { top, left, width, ...rest }} = el;
          return (
          <animated.div
            key={item.key}
            style={{
              position: "absolute",
              // width,
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
    </div>
  );
}
